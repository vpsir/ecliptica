import { lunarShadowStateAt } from "./shadowState";

export async function findMaximumEclipse(
    center: Date,
    hours = 6
): Promise<Date> {

    const stepMs = 2 * 60 * 1000; // 2 minutes
    const start = center.getTime() - hours * 3600 * 1000;
    const end = center.getTime() + hours * 3600 * 1000;

    let minDistance = Infinity;
    let minTime = center;

    for (let t = start; t <= end; t += stepMs) {
        const state = await lunarShadowStateAt(new Date(t));

        if (state.shadowDistance < minDistance) {
            minDistance = state.shadowDistance;
            minTime = new Date(t);
        }
    }

    return minTime;
}