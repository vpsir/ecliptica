export function angularSeparation(
    ra1: number, dec1: number,
    ra2: number, dec2: number
): number {
    const r = Math.PI / 180;
    const a1 = ra1 * 15 * r;
    const a2 = ra2 * 15 * r;
    const d1 = dec1 * r;
    const d2 = dec2 * r;

    return Math.acos(
        Math.sin(d1) * Math.sin(d2) +
        Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2)
    );
}

export function normalizeAngle(deg: number) {
    return (deg + 360) % 360;
}