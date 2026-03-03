import { getSunAndMoon } from "../shared/astro";
import { angularSeparationDeg } from "../shared/angularSeparation";
import { classifyLunarEclipse } from "./classifier";
import { createLocation } from "astronomy-bundle/earth";
import { getUmbraAndPenumbraRadii } from "./geometry";
import { solveLunarEclipse } from "./contactSolver";


export async function checkLunarEclipse(date: Date, lat: number, lon: number) {
    const { sun, moon } = await getSunAndMoon(date);
    const location = createLocation(lat, lon, 0);

    const horizontal = await moon.getApparentTopocentricHorizontalCoordinates(location);
    const moonAltitude = horizontal.altitude;
    console.log("Moon Altitude:", moonAltitude.toFixed(2), "°");

    const sunEqu = await sun.getApparentGeocentricEquatorialSphericalCoordinates();
    const moonEqu = await moon.getApparentGeocentricEquatorialSphericalCoordinates();

    console.log("Sun RA/Dec:", sunEqu.rightAscension, sunEqu.declination);
    console.log("Moon RA/Dec:", moonEqu.rightAscension, moonEqu.declination);

    const sep = angularSeparationDeg(
        sunEqu.rightAscension,
        sunEqu.declination,
        moonEqu.rightAscension,
        moonEqu.declination
    );
    console.log("Sun-Moon Angular Separation:", sep.toFixed(2), "°");

    const moonEcl = await moon.getApparentGeocentricEclipticSphericalCoordinates();
    console.log("Moon Ecliptic Latitude:", moonEcl.lat);

    const moonAngularDiameter = await moon.getAngularDiameter();
    const moonRadius = moonAngularDiameter / 2;
    console.log("Moon Angular Radius:", moonRadius);

    const { umbraRadius, penumbraRadius } = await getUmbraAndPenumbraRadii(sun, moon);
    console.log("Dynamic Umbra Radius:", umbraRadius.toFixed(2), "°");
    console.log("Dynamic Penumbra Radius:", penumbraRadius.toFixed(2), "°");

    const shadowRA = ((sunEqu.rightAscension + 180) + 360) % 360;
    const shadowDec = -sunEqu.declination;
    const shadowDistance = angularSeparationDeg(
        shadowRA,
        shadowDec,
        moonEqu.rightAscension,
        moonEqu.declination
    );
    console.log("Distance from Umbra Center:", shadowDistance);

    const message = classifyLunarEclipse(
        moonEcl.lat,
        shadowDistance,
        moonRadius,
        umbraRadius,
        penumbraRadius,
        moonAltitude
    );
    console.log(message);

    const contacts = await solveLunarEclipse(date, lat, lon);
    console.log("P1:", contacts.p1);
    console.log("U1:", contacts.u1);
    console.log("U2:", contacts.u2);
    console.log("MAX:", contacts.max);
    console.log("U3:", contacts.u3);
    console.log("U4:", contacts.u4);
    console.log("P4:", contacts.p4);
    console.log("Umbral Magnitude at MAX:", contacts.umbralMagnitude);
    console.log("Penumbral Magnitude at MAX:", contacts.penumbralMagnitude);
    console.log("Durations:", contacts.durations);
    console.log("Classification:", contacts.classification);
}