export async function solveRoot(
    f: (date: Date) => Promise<number>,
    t1: Date,
    t2: Date,
    toleranceMs = 1000
): Promise<Date> {

    let a = t1.getTime();
    let b = t2.getTime();

    let fA = await f(new Date(a));

    while (b - a > toleranceMs) {
        const mid = Math.floor((a + b) / 2);
        const fMid = await f(new Date(mid));

        if (fA * fMid <= 0) {
            b = mid;
        } else {
            a = mid;
            fA = fMid;
        }
    }

    return new Date(Math.floor((a + b) / 2));
}