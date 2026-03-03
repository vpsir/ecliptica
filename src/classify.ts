export function classifyEclipse(
    separation: number,
    latitude: number,
    shadowDistance: number,
    moonRadius: number,
    umbraRadius: number
): string {

    if (separation < 170) {
        return "🌒 Sun and Moon are not in opposition. No lunar eclipse geometry.";
    }

    if (Math.abs(latitude) > 1.5) {
        return "🌕 Full Moon detected, but too far from orbital node.";
    }

    if (shadowDistance > (umbraRadius + moonRadius)) {
        return "🌑 Moon near shadow, but misses Earth's umbra.";
    }

    if (shadowDistance > (umbraRadius - moonRadius)) {
        return "🌑 Partial lunar eclipse in progress.";
    }

    return "🔴 Total lunar eclipse — Moon fully inside Earth's umbra.";
}