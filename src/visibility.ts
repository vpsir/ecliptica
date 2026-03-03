import { createTimeOfInterest } from "astronomy-bundle/time";
import { createMoon } from "astronomy-bundle/moon";
import { createLocation } from "astronomy-bundle/earth";

function toRad(deg: number) {
    return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
    return (rad * 180) / Math.PI;
}

export async function getMoonAltitude(
    date: Date,
    lat: number,
    lon: number
): Promise<number> {
    const toi = createTimeOfInterest.fromDate(date);
    const location = createLocation(lat, lon, 0);

    const moon = createMoon(toi);

    // Get apparent equatorial coordinates (RA in hours, Dec in degrees)
    const equ = await moon.getApparentGeocentricEquatorialSphericalCoordinates();

    const ra = toRad(equ.rightAscension * 15); // hours → degrees → rad
    const dec = toRad(equ.declination);

    // Local Apparent Sidereal Time
    const lst = toRad(toi.getLocalApparentSiderealTime(location) * 15);

    const H = lst - ra; // Hour angle

    const phi = toRad(lat);

    // Altitude formula
    const sinAlt =
        Math.sin(phi) * Math.sin(dec) +
        Math.cos(phi) * Math.cos(dec) * Math.cos(H);

    return toDeg(Math.asin(sinAlt));
}