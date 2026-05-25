import { apiFetch } from "./api";

export async function searchLocations(query, signal) {
  const data = await apiFetch(`/geocode/search?q=${encodeURIComponent(query)}`, {
    signal
  });
  return data.results;
}
