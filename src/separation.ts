export function angularSeparationDeg(
    ra1Deg: number,
    dec1Deg: number,
    ra2Deg: number,
    dec2Deg: number
): number {
    const toRad = (d: number) => (d * Math.PI) / 180;

    const r1 = toRad(ra1Deg);
    const r2 = toRad(ra2Deg);
    const d1 = toRad(dec1Deg);
    const d2 = toRad(dec2Deg);

    const cosD =
        Math.sin(d1) * Math.sin(d2) +
        Math.cos(d1) * Math.cos(d2) * Math.cos(r1 - r2);

    return Math.acos(cosD) * (180 / Math.PI);
}