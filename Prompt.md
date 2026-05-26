# RideJunto - Full Stack Ride Sharing Platform

## Context and Role

You are a full stack developer specializing in high-performance, location-aware web applications.

Your responsibility is to design and build **RideJunto**, a production-grade ride sharing platform that connects drivers and riders through real-time location matching, interactive mapping, and a clean, fast interface.

The platform must handle dynamic geospatial data, authenticated user sessions, and live ride coordination while staying responsive, accessible, and cost effective. Do not use paid map APIs.

## Objective

Build a complete full stack ride sharing web application that:

- Delivers an interactive, cost-free mapping experience using Leaflet and OpenStreetMap.
- Provides a modern, responsive UI with smooth transitions and zero layout conflicts.
- Includes functional location search with free autocomplete using Nominatim or Photon.
- Supports secure user authentication and session management.
- Logs ride requests and matches persistently in a database.
- Returns real-time ride availability with estimated pricing and travel time.

## Input Data and Feature Requirements

### Required Screens

The platform must implement the following views.

#### Landing / Hero Section

- Animated introduction with clear CTAs for drivers and riders.
- Brief value proposition and feature highlights.

#### Authentication Portal

- Registration and login forms with validation.
- JWT or session-based authentication.
- Secure password hashing with bcrypt.

#### Dashboard / Map View

- Full-screen interactive map using Leaflet and OpenStreetMap.
- Sidebar panel for ride search and results.
- Map markers for pickup, drop-off, and available drivers.
- No overlapping UI elements or blocked map controls.

#### Location Autocomplete Search

- Free-tier autocomplete using Nominatim or Photon API.
- Dropdown renders above the map layer without layout breaks.
- Selecting a result places a marker and updates map bounds.

#### Ride Options / Match Panel

- List of available rides matching the requested route.
- Each result shows driver name, ETA, seats available, and estimated fare.
- One-tap booking confirmation.

## Form Fields

### User Registration

| Field | Validation |
| --- | --- |
| Full Name | Required, minimum 2 characters |
| Email | Required, valid email format |
| Phone Number | Required, numeric, 10-13 digits |
| Password | Required, minimum 8 characters, hashed on save |

### Ride Request

| Field | Validation |
| --- | --- |
| Pickup Location | Required, must resolve to coordinates |
| Drop-off Location | Required, must resolve to coordinates |
| Number of Seats | Required, integer from 1-6 |
| Ride Type | Required, one of `economy`, `shared`, or `premium` |

## Data Processing Requirements

- Resolve all location inputs to `{ lat, lng }` before storing or querying.
- Validate latitude within `[-90, 90]` and longitude within `[-180, 180]`.
- Sanitize all user inputs to prevent XSS and injection attacks.
- Hash passwords using bcrypt with a minimum salt round of `10`.
- Calculate estimated fare based on Haversine distance between coordinates.
- Rate limit the autocomplete endpoint to prevent Nominatim abuse.
- Return all API responses as structured JSON.

### Success Response

```json
{
  "status": "success",
  "data": {}
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": 400
}
```

## Output Requirements

The completed application must deliver:

- A smooth, fully interactive ride sharing experience from login to booking confirmation.
- Overlap-free location autocomplete that cleanly layers above the map.
- Ride match results with route visualization drawn on the map.
- Booking confirmation screen shown to the user immediately after a successful match.
- Persistent ride history accessible from the user dashboard.
- Graceful degradation when map services or autocomplete APIs are unreachable.

## Email / Notification

On successful booking, trigger an email to both driver and rider containing:

- Pickup and drop-off addresses.
- Driver / rider name and contact.
- Estimated fare and ETA.
- Timestamp.

## Error Handling

### Frontend

- Display inline validation errors per field before submission.
- Show a dismissible banner for network or API failures.
- If map tiles fail to load, display a fallback message with a retry option.
- If autocomplete returns no results, display: `"No locations found. Try a different search."`

### Backend

- Return `400` for invalid or missing input fields with field-specific error details.
- Return `401` for unauthenticated requests to protected routes.
- Return `404` when a ride or user record does not exist.
- Return `429` when rate limits are exceeded on the autocomplete endpoint.
- Return `500` for unexpected server failures with a sanitized message. Never expose stack traces in production.
- Log all backend failures with timestamp, route, error message, and request payload.

## Documentation Requirements

Provide complete documentation covering:

- Frontend and backend folder structure.
- Step-by-step local setup instructions.
- Full list of environment variables with descriptions.
- Deployment steps, such as Railway, Render, or Vercel with a separate API.
- Map provider configuration notes, including Nominatim usage policy and Photon as an alternative.

## Performance and Scalability

- Lazy load the map component to reduce initial bundle size.
- Debounce autocomplete input at `300ms` to avoid excessive API calls.
- Use `useMemo` and `useCallback` where applicable to prevent unnecessary re-renders.
- Avoid layout thrashing during map updates by batching DOM changes.
- Only use GPU-friendly CSS properties such as `transform` and `opacity` for animations.
- Index database fields on `userId`, `status`, and `createdAt` for fast query performance.
- Paginate ride history results with a default page size of `20`.
- Support horizontal API scaling via stateless JWT authentication.
- Apply `helmet.js` and CORS restrictions on all Express routes.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, JavaScript, Tailwind CSS |
| Mapping | Leaflet.js, OpenStreetMap tiles |
| Autocomplete | Nominatim API, Photon as fallback |
| Backend | Node.js, Express |
| Authentication | JWT, bcrypt |
| Database | MongoDB with Mongoose or PostgreSQL with Prisma |
| Email | Nodemailer with SMTP or Resend API |
| Config / Security | dotenv, helmet.js, express-rate-limit |
| Dev Tooling | ESLint, Prettier, Nodemon |
