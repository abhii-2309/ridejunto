import xss from "xss";

export function sanitizeRequest(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, item]) => [key, sanitizeValue(item)])
    );
  }

  if (typeof value === "string") return xss(value.trim());

  return value;
}
