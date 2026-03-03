import { createTimeOfInterest } from "astronomy-bundle/time";
import { createSun } from "astronomy-bundle/sun";
import { createMoon } from "astronomy-bundle/moon";

export async function getSunAndMoon(date: Date) {
    const toi = createTimeOfInterest.fromDate(date);

    const sunObj = createSun(toi);
    const moonObj = createMoon(toi);

    return {sunObj, moonObj};
}