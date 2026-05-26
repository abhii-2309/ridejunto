import { env } from "../config/env.js";
import { cleanString, isValidCoordinate } from "../utils/validators.js";
import { httpError } from "../utils/httpError.js";

const cache = new Map();
const cacheTtlMs = 5 * 60 * 1000;

export async function searchLocations(query) {
  const q = cleanString(query);
  if (q.length < 2) {
    throw httpError(400, "Enter at least two characters to search.", "INVALID_QUERY");
  }

  const cacheKey = `search:${q.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = new URL("/search", env.geocodeBaseUrl);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");

  const response = await fetch(url, {
    headers: {
      "User-Agent": env.geocodeUserAgent,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw httpError(502, "Unable to fetch location suggestions", "GEOCODE_FAILED");
  }

  const data = await response.json();
  const results = data
    .map((item) => ({
      id: String(item.place_id || item.osm_id),
      label: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon)
    }))
    .filter((item) => item.label && isValidCoordinate(item.lat, item.lng));

  setCache(cacheKey, results);
  return results;
}

export async function reverseLocation(lat, lng) {
  if (!isValidCoordinate(lat, lng)) {
    throw httpError(400, "Latitude and longitude are invalid", "INVALID_COORDINATES");
  }

  const cacheKey = `reverse:${lat}:${lng}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = new URL("/reverse", env.geocodeBaseUrl);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "jsonv2");

  const response = await fetch(url, {
    headers: {
      "User-Agent": env.geocodeUserAgent,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw httpError(502, "Unable to reverse geocode coordinates", "GEOCODE_FAILED");
  }

  const item = await response.json();
  const result = {
    id: String(item.place_id || `${lat},${lng}`),
    label: item.display_name || `${lat}, ${lng}`,
    lat: Number(lat),
    lng: Number(lng)
  };

  setCache(cacheKey, result);
  return result;
}

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

function setCache(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + cacheTtlMs
  });
}
