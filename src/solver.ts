// Generic binary solver to find moment when condition crosses zero
export async function solveContact(
    conditionFn: (d: Date) => Promise<number>,
    start: Date,
    end: Date,
    tolMs = 500
): Promise<Date> {
    let s = start.getTime(),
        e = end.getTime();

    while (e - s > tolMs) {
        const mid = (s + e) / 2;
        const val = await conditionFn(new Date(mid));

        if (val > 0) e = mid;
        else s = mid;
    }

    return new Date((s + e) / 2);
}