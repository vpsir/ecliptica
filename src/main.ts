import { checkLunarEclipse } from "./eclipse/lunar/check";

(async function () {
    const date = new Date();
    await checkLunarEclipse(date, 23.18, 72.2); // KADI
})();