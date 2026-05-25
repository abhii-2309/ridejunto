import { searchLocations, reverseLocation } from "../services/geocode.service.js";

export async function search(req, res, next) {
  try {
    const results = await searchLocations(req.query.q);
    res.json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
}

export async function reverse(req, res, next) {
  try {
    const result = await reverseLocation(req.query.lat, req.query.lng);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
}
