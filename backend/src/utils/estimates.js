export function haversineKm(start, end) {
  const radiusKm = 6371;
  const latDelta = toRadians(end.lat - start.lat);
  const lngDelta = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function buildRideEstimate(pickup, dropoff, seats) {
  const distance = Math.max(haversineKm(pickup, dropoff), 0.4);
  const duration = Math.ceil((distance / 24) * 60 + 5);
  const fare = 4.5 + distance * 1.35 + seats * 0.75;

  return {
    estimatedDistanceKm: Number(distance.toFixed(1)),
    estimatedDurationMinutes: duration,
    estimatedFare: Number(fare.toFixed(2))
  };
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}
