import { checkLunarEclipse } from "./eclipse/lunar/check";

(async function () {
    const date = new Date("2026-03-03T00:00:00Z");
    await checkLunarEclipse(date, 23.18, 72.2); // KADI
})();