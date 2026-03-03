import Sun from "astronomy-bundle/sun/Sun";
import Moon from "astronomy-bundle/moon/Moon";

function toDeg(rad: number) {
    return rad * (180 / Math.PI);
}

export async function getUmbraAndPenumbraRadii(sun: Sun, moon: Moon): Promise<{ umbraRadius: number; penumbraRadius: number; }> {
    const EARTH_RADIUS_KM = 6378.137;
    const SUN_RADIUS_KM = 696000;
    const AU_KM = 149597870.7;

    const sunDistanceAU = (await sun.getGeocentricEclipticSphericalDateCoordinates()).radiusVector;
    const moonDistanceAU = (await moon.getGeocentricEclipticSphericalDateCoordinates()).radiusVector;

    const sunDistanceKm = sunDistanceAU * AU_KM;
    const moonDistanceKm = moonDistanceAU * AU_KM;

    const umbraRadiusKm = EARTH_RADIUS_KM - moonDistanceKm * (SUN_RADIUS_KM - EARTH_RADIUS_KM) / sunDistanceKm;
    const penumbraRadiusKm = EARTH_RADIUS_KM + moonDistanceKm * (SUN_RADIUS_KM - EARTH_RADIUS_KM) / sunDistanceKm;

    const umbraRadius = toDeg(Math.asin(umbraRadiusKm / moonDistanceKm));
    const penumbraRadius = toDeg(Math.asin(penumbraRadiusKm / moonDistanceKm));

    console.log("sunDistanceAU:", sunDistanceAU);
    console.log("sunDistanceKm:", sunDistanceKm);
    console.log("moonDistanceKm:", moonDistanceKm);
    console.log("umbraRadiusKm:", umbraRadiusKm);
    console.log("ratio:", umbraRadiusKm / moonDistanceKm);

    return { umbraRadius, penumbraRadius };
}