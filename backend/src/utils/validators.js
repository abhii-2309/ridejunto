import validator from "validator";
import xss from "xss";

export function cleanString(value) {
  return xss(String(value || "").trim());
}

export function isValidEmail(value) {
  return validator.isEmail(String(value || ""));
}

export function isValidPhone(value) {
  return validator.isMobilePhone(String(value || ""), "any", {
    strictMode: false
  });
}

export function isValidCoordinate(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function parseLocation(location) {
  if (!location || typeof location !== "object") return null;

  const label = cleanString(location.label);
  const lat = Number(location.lat);
  const lng = Number(location.lng);

  if (!label || !isValidCoordinate(lat, lng)) return null;

  return { label, lat, lng };
}
