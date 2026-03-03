import { getSunAndMoon } from "./astro";
import { angularSeparationDeg } from "./separation";
import { normalizeAngle } from "./utils";
import { classifyEclipse } from "./classify";

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

    const moonEcl = await moonObj.getApparentGeocentricEclipticSphericalCoordinates();
    console.log("Moon Ecliptic Latitude:", moonEcl.lat);

    const moonAngularDiameter = await moonObj.getAngularDiameter();

    const moonRadius = moonAngularDiameter / 2;
    console.log("Moon Angular Radius:", moonRadius);

    const umbraRadius = 0.727; // degrees (good first approximation)

    const shadowRA = normalizeAngle(sunEqu.rightAscension + 180);
    const shadowDec = -sunEqu.declination;

    const shadowDistance = angularSeparationDeg(
        shadowRA,
        shadowDec,
        moonEqu.rightAscension,
        moonEqu.declination
    );
    console.log("Distance from Umbra Center:", shadowDistance);

    const message = classifyEclipse(
        sep,
        moonEcl.lat,
        shadowDistance,
        moonRadius,
        umbraRadius
    );
    console.log(message);

})();