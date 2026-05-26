import { apiFetch } from "./api";

export async function createRide(payload) {
  return apiFetch("/rides", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchActiveRides() {
  return apiFetch("/rides/active");
}

export async function fetchRideHistory() {
  return apiFetch("/rides/history");
}

export async function updateRideStatus(id, status) {
  return apiFetch(`/rides/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
