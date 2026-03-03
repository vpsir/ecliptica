import { getSunAndMoon } from "./astro";
import { angularSeparationDeg } from "./separation";

(async function () {
    const date = new Date();

    const { sunObj, moonObj } = await getSunAndMoon(date);

    const sunEqu = await sunObj.getApparentGeocentricEquatorialSphericalCoordinates();
    const moonEqu = await moonObj.getApparentGeocentricEquatorialSphericalCoordinates();

    console.log("Sun RA/Dec:", sunEqu.rightAscension, sunEqu.declination);
    console.log("Moon RA/Dec:", moonEqu.rightAscension, moonEqu.declination);

    const sep = angularSeparationDeg(
        sunEqu.rightAscension,
        sunEqu.declination,
        moonEqu.rightAscension,
        moonEqu.declination
    );

    console.log("Sun-Moon Angular Separation:", sep.toFixed(2), "°");

    // Now this works correctly
    const moonEcl = await moonObj.getApparentGeocentricEclipticSphericalCoordinates();
    console.log("Moon Ecliptic Latitude:", moonEcl.lat);
})();