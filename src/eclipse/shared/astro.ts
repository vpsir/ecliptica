import { createTimeOfInterest } from "astronomy-bundle/time";
import { createSun } from "astronomy-bundle/sun";
import { createMoon } from "astronomy-bundle/moon";

export async function getSunAndMoon(date: Date) {
    const toi = createTimeOfInterest.fromDate(date);

    const sun = createSun(toi);
    const moon = createMoon(toi);

    return {sun, moon};
}