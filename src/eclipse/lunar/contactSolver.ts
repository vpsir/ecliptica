import { createTimeOfInterest } from "astronomy-bundle/time";
import { createMoon } from "astronomy-bundle/moon";
import { lunarShadowStateAt } from "./shadowState";
import { findMaximumEclipse } from "./findMax";
import { solveRoot } from "./rootSolver";
import type { LunarContacts } from "./types";
import { computeLunarMagnitude } from "./magnitude";
import { evaluateVisibility } from "./visibility";
import { computeLunarDurations } from "./duration";
import { classifyMagnitude } from "./classifier";

async function getNearestFullMoon(date: Date): Promise<Date> {
    const toi = createTimeOfInterest.fromDate(date);
    const moon = createMoon(toi);

    const nextFull = moon.getUpcomingFullMoon().getDate();

    // Go back ~29 days to ensure we land before previous full moon
    const previousToi = createTimeOfInterest.fromDate(
        new Date(date.getTime() - 29 * 24 * 3600 * 1000)
    );
    const previousMoon = createMoon(previousToi);
    const prevFull = previousMoon.getUpcomingFullMoon().getDate();

    const diffNext = Math.abs(nextFull.getTime() - date.getTime());
    const diffPrev = Math.abs(prevFull.getTime() - date.getTime());

    return diffPrev < diffNext ? prevFull : nextFull;
}

export async function solveLunarEclipse(date: Date, lat: number, lon: number): Promise<LunarContacts> {

    const fullMoon = await getNearestFullMoon(date);
    const maxApprox = await findMaximumEclipse(fullMoon);

    const contacts: LunarContacts = { max: maxApprox };

    const scanHours = 6;
    const stepMs = 60 * 1000; // 1 minute
    const start = maxApprox.getTime() - scanHours * 3600 * 1000;
    const end = maxApprox.getTime() + scanHours * 3600 * 1000;

    const startTime = start;
    const maxTime = maxApprox.getTime();
    const endTime = end;

    async function scanBoundary(
        boundaryFn: (d: Date) => Promise<number>,
        startTime: number,
        endTime: number,
        stepMs: number
    ) {
        let prevTime = new Date(startTime);
        let prevVal = await boundaryFn(prevTime);

        for (let t = startTime + stepMs; t <= endTime; t += stepMs) {
            const currTime = new Date(t);
            const currVal = await boundaryFn(currTime);

            if (prevVal * currVal <= 0) {
                return solveRoot(boundaryFn, prevTime, currTime);
            }

            prevTime = currTime;
            prevVal = currVal;
        }

        return undefined;
    }

    const penumbraBoundary = (d: Date) =>
        lunarShadowStateAt(d).then(s =>
            s.shadowDistance - (s.penumbraRadius + s.moonRadius)
        );

    const umbraBoundary = (d: Date) =>
        lunarShadowStateAt(d).then(s =>
            s.shadowDistance - (s.umbraRadius + s.moonRadius)
        );

    const totalBoundary = (d: Date) =>
        lunarShadowStateAt(d).then(s =>
            s.shadowDistance - (s.umbraRadius - s.moonRadius)
        );

    // contacts.p1 = await scanBoundary(penumbraBoundary);
    // contacts.u1 = await scanBoundary(umbraBoundary);
    // contacts.u2 = await scanBoundary(totalBoundary);

    // // Mirror exits by scanning after max
    // contacts.u3 = contacts.u2 ? await scanBoundary(totalBoundary) : undefined;
    // contacts.u4 = contacts.u1 ? await scanBoundary(umbraBoundary) : undefined;
    // contacts.p4 = contacts.p1 ? await scanBoundary(penumbraBoundary) : undefined;

    contacts.p1 = await scanBoundary(
        penumbraBoundary,
        startTime,
        maxTime,
        stepMs
    );

    contacts.u1 = await scanBoundary(
        umbraBoundary,
        startTime,
        maxTime,
        stepMs
    );

    contacts.u2 = await scanBoundary(
        totalBoundary,
        startTime,
        maxTime,
        stepMs
    );

    contacts.u3 = await scanBoundary(
        totalBoundary,
        maxTime,
        endTime,
        stepMs
    );

    contacts.u4 = await scanBoundary(
        umbraBoundary,
        maxTime,
        endTime,
        stepMs
    );

    contacts.p4 = await scanBoundary(
        penumbraBoundary,
        maxTime,
        endTime,
        stepMs
    );

    // Compute magnitude at MAX
    if (contacts.max) {
        const stateAtMax = await lunarShadowStateAt(contacts.max);

        const magnitude = computeLunarMagnitude(
            stateAtMax.shadowDistance,
            stateAtMax.moonRadius,
            stateAtMax.umbraRadius,
            stateAtMax.penumbraRadius
        );

        contacts["umbralMagnitude"] = magnitude.umbralMagnitude;
        contacts["penumbralMagnitude"] = magnitude.penumbralMagnitude;
    }

    if (lat !== undefined && lon !== undefined) {
        const {
            p1, u1, u2, max, u3, u4, p4
        } = contacts;

        const visibility = await evaluateVisibility(
            { p1, u1, u2, max, u3, u4, p4 },
            lat,
            lon
        );

        contacts.visibility = visibility;
    }

    // Durations
    const durations = computeLunarDurations(contacts);
    contacts["durations"] = durations;

    // Classification
    contacts["classification"] = classifyMagnitude(
        contacts.umbralMagnitude
    );

    return contacts;
}