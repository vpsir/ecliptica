import { angularSeparationDeg } from "../shared/angularSeparation";
import { getSunAndMoon } from "../shared/astro";
import { getUmbraAndPenumbraRadii } from "./geometry";

export async function lunarShadowStateAt(date: Date) {
    const { sun, moon } = await getSunAndMoon(date);

    const sunEqu =
        await sun.getApparentGeocentricEquatorialSphericalCoordinates();

    const moonEqu =
        await moon.getApparentGeocentricEquatorialSphericalCoordinates();

    const moonEcl =
        await moon.getApparentGeocentricEclipticSphericalCoordinates();

    const { umbraRadius, penumbraRadius } =
        await getUmbraAndPenumbraRadii(sun, moon);

    const moonAngularDiameter = await moon.getAngularDiameter();
    const moonRadius = moonAngularDiameter / 2;

    const shadowRA = (sunEqu.rightAscension + 180) % 360;
    const shadowDec = -sunEqu.declination;

    const shadowDistance = angularSeparationDeg(
        shadowRA,
        shadowDec,
        moonEqu.rightAscension,
        moonEqu.declination
    );

    return {
        shadowDistance,
        moonRadius,
        umbraRadius,
        penumbraRadius,
        latitude: moonEcl.lat
    };
}