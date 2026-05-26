export function buildRideMatches(ride, activeRides = []) {
  const candidates = activeRides
    .filter((candidate) => candidate.id !== ride.id && candidate.status !== "cancelled")
    .slice(0, 3);

  if (candidates.length > 0) {
    return candidates.map((candidate) => ({
      id: candidate.id,
      status: "available",
      seats: candidate.seats,
      pickup: candidate.pickup,
      dropoff: candidate.dropoff,
      estimatedFare: candidate.estimatedFare,
      estimatedDurationMinutes: candidate.estimatedDurationMinutes
    }));
  }

  return [
    {
      id: `match-${ride.id}`,
      status: "nearby",
      seats: ride.seats,
      pickup: ride.pickup,
      dropoff: ride.dropoff,
      estimatedFare: Number((ride.estimatedFare * 0.92).toFixed(2)),
      estimatedDurationMinutes: ride.estimatedDurationMinutes + 3
    }
  ];
}
