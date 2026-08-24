const env = require("../config/env");
const { haversineDistanceKm } = require("../utils/geo");

// under this distance we just say "arriving now" instead of a number
const ARRIVING_NOW_THRESHOLD_KM = 0.1;

function calculateEta(driverLat, driverLng, destLat, destLng) {
  const distanceKm = haversineDistanceKm(driverLat, driverLng, destLat, destLng);
  const roundedDistance = Number(distanceKm.toFixed(2));

  if (distanceKm < ARRIVING_NOW_THRESHOLD_KM) {
    return { distanceKm: roundedDistance, minutes: null, label: "Arriving now" };
  }

  const rawMinutes = (distanceKm / env.AVERAGE_SPEED_KMPH) * 60;
  const minutes = Math.max(1, Math.round(rawMinutes));

  return { distanceKm: roundedDistance, minutes };
}

module.exports = { calculateEta };
