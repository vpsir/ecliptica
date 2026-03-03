import type { LunarContacts } from "./types";


function diffSeconds(a?: Date, b?: Date): number | undefined {
    if (!a || !b) return undefined;
    return Math.round((b.getTime() - a.getTime()) / 1000);
}

function formatDuration(seconds?: number): string | undefined {
    if (seconds === undefined) return undefined;

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}

export function computeLunarDurations(contacts: LunarContacts) {
    const totalDurationSec = diffSeconds(contacts.p1, contacts.p4);
    const umbralDurationSec = diffSeconds(contacts.u1, contacts.u4);
    const totalityDurationSec = diffSeconds(contacts.u2, contacts.u3);

    return {
        totalDurationSeconds: totalDurationSec,
        umbralDurationSeconds: umbralDurationSec,
        totalityDurationSeconds: totalityDurationSec,
        totalDuration: formatDuration(totalDurationSec),
        umbralDuration: formatDuration(umbralDurationSec),
        totalityDuration: formatDuration(totalityDurationSec)
    };
}