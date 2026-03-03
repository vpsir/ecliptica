export function computeLunarMagnitude(
    shadowDistance: number,
    moonRadius: number,
    umbraRadius: number,
    penumbraRadius: number
) {

    const umbralMag =
        (umbraRadius + moonRadius - shadowDistance) / (2 * moonRadius);

    const penumbralMag =
        (penumbraRadius + moonRadius - shadowDistance) / (2 * moonRadius);

    return {
        umbralMagnitude: umbralMag,
        penumbralMagnitude: penumbralMag
    };
}