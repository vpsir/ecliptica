import { createLocation } from "astronomy-bundle/earth";
import { createTimeOfInterest } from "astronomy-bundle/time";
import { createMoon } from "astronomy-bundle/moon";
import type { LunarContactTimes } from "./types";

async function moonAltitudeAt(
    date: Date,
    lat: number,
    lon: number
) {
    const toi = createTimeOfInterest.fromDate(date);
    const location = createLocation(lat, lon, 0);
    const moon = createMoon(toi);

    const horizontal =
        await moon.getApparentTopocentricHorizontalCoordinates(location);

    return horizontal.altitude;
}

export async function evaluateVisibility(
    contacts: LunarContactTimes,
    lat: number,
    lon: number
) {

    const visibility: Record<string, boolean> = {};

    for (const key of Object.keys(contacts) as (keyof LunarContactTimes)[]) {
        const time = contacts[key];

        if (!time) {
            visibility[key] = false;
            continue;
        }

        const altitude = await moonAltitudeAt(time, lat, lon);
        visibility[key] = altitude > 0;
    }

    return visibility;
}