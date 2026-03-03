export function classifyLunarEclipse(
    latitude: number,
    shadowDistance: number,
    moonRadius: number,
    umbraRadius: number,
    penumbraRadius: number,
    moonAltitude: number
): string {

    const isVisible = moonAltitude > 0;

    // 🌕 Not near node → no eclipse possible
    if (Math.abs(latitude) > 1.5) {
        if (isVisible) {
            return "🌕 Full Moon visible, but too far from orbital node. No lunar eclipse.";
        }
        return "🌕 Full Moon below horizon. No lunar eclipse.";
    }

    const umbraOuter = umbraRadius + moonRadius;
    const umbraInner = umbraRadius - moonRadius;
    const penumbraOuter = penumbraRadius + moonRadius;

    // 🌑 No shadow intersection
    if (shadowDistance > penumbraOuter) {
        if (isVisible) {
            return "🌑 Full Moon visible. It does not enter Earth's shadow.";
        }
        return "🌑 No eclipse and Moon is below horizon.";
    }

    // 🌘 Penumbral eclipse
    if (shadowDistance > umbraOuter) {
        if (isVisible) {
            return "🌘 Penumbral lunar eclipse visible — subtle shading on the Moon.";
        }
        return "🌘 Penumbral lunar eclipse occurring, but Moon is below horizon at this location.";
    }

    // 🌑 Partial eclipse
    if (shadowDistance > umbraInner) {
        if (isVisible) {
            return "🌑 Partial lunar eclipse visible — Moon partially inside Earth's umbra.";
        }
        return "🌑 Partial lunar eclipse occurring, but Moon is below horizon at this location.";
    }

    // 🔴 Total eclipse
    if (isVisible) {
        return "🔴 Total lunar eclipse visible — Moon fully immersed in Earth's umbra.";
    }

    return "🔴 Total lunar eclipse occurring, but Moon is below horizon at this location.";
}