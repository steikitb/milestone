const EARTH_RADIUS_KM = 6371;
const URBAN_ROAD_FACTOR = 1.3; // faktor belok jalan kota, lihat docs/01-analisis-konsep-awal.md

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Jarak jalan perkiraan dalam km (haversine × faktor belok).
// Pengganti sementara OSRM/Valhalla — cukup akurat untuk Fase 0-1, lihat docs/01.
function estimateDistanceKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const straightLineKm = 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  return straightLineKm * URBAN_ROAD_FACTOR;
}

module.exports = { estimateDistanceKm };
