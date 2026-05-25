# RideJunto

RideJunto is a high-performance ride sharing web application designed around affordable mapping, responsive ride discovery, secure authentication, and real-time ride matching. The app uses OpenStreetMap and Leaflet instead of paid map SDKs, with a React frontend and an Express backend.

## Features

- Interactive Leaflet map powered by OpenStreetMap tiles
- Free location autocomplete through backend geocoding proxy endpoints
- Rider and driver landing flows with clear calls to action
- Secure login and registration with validated user details
- Full-screen dashboard map with search sidebar and ride match panel
- Pickup and drop-off marker placement from selected coordinates
- Ride request form with validation for locations, coordinates, and seats
- Ride history and active request storage
- Real-time ride match updates using WebSockets or Server-Sent Events
- Smooth transitions for overlays, panels, search results, and map popups
- Mobile-first, accessible UI with semantic structure and ARIA labels
- Basic rate limiting and input sanitization on backend endpoints

## Technology Stack

### Frontend

- React
- JavaScript
- Tailwind CSS
- Leaflet
- React Leaflet
- OpenStreetMap

### Backend

- Node.js
- Express
- dotenv
- JWT or secure session cookies
- bcrypt for password hashing
- express-rate-limit
- helmet
- cors
- express-validator or zod

### Database

Recommended:

- MongoDB with Mongoose

Alternative:

- PostgreSQL with Prisma or node-postgres

## Folder Structure

```text
ridejunto/
+-- README.md
+-- frontend/
|   +-- package.json
|   +-- index.html
|   +-- src/
|   |   +-- App.jsx
|   |   +-- main.jsx
|   |   +-- assets/
|   |   +-- components/
|   |   |   +-- auth/
|   |   |   +-- map/
|   |   |   +-- rides/
|   |   |   +-- ui/
|   |   +-- hooks/
|   |   +-- pages/
|   |   |   +-- Landing.jsx
|   |   |   +-- Auth.jsx
|   |   |   +-- Dashboard.jsx
|   |   +-- services/
|   |   |   +-- api.js
|   |   |   +-- auth.js
|   |   |   +-- geocode.js
|   |   +-- styles/
|   |   +-- utils/
|   +-- tailwind.config.js
|   +-- .env.example
+-- backend/
|   +-- package.json
|   +-- src/
|   |   +-- server.js
|   |   +-- app.js
|   |   +-- config/
|   |   |   +-- db.js
|   |   |   +-- env.js
|   |   +-- controllers/
|   |   |   +-- auth.controller.js
|   |   |   +-- geocode.controller.js
|   |   |   +-- ride.controller.js
|   |   +-- middleware/
|   |   |   +-- auth.middleware.js
|   |   |   +-- error.middleware.js
|   |   |   +-- rateLimit.middleware.js
|   |   |   +-- sanitize.middleware.js
|   |   +-- models/
|   |   |   +-- User.js
|   |   |   +-- Ride.js
|   |   +-- routes/
|   |   |   +-- auth.routes.js
|   |   |   +-- geocode.routes.js
|   |   |   +-- ride.routes.js
|   |   +-- services/
|   |   |   +-- geocode.service.js
|   |   |   +-- match.service.js
|   |   +-- sockets/
|   |   |   +-- ride.socket.js
|   |   +-- utils/
|   +-- .env.example
+-- docs/
    +-- deployment.md
```

## Application Flow

1. Users land on the animated hero page and choose rider or driver actions.
2. New users register with name, email, phone number, and password.
3. Returning users log in through the authentication portal.
4. Authenticated users enter the dashboard with a full-screen Leaflet map.
5. Users search pickup and drop-off locations through autocomplete fields.
6. The backend fetches location suggestions from a free geocoding provider and returns normalized JSON.
7. Selecting a suggestion places a marker and updates the map view.
8. Users submit a ride request with pickup, drop-off, and number of seats.
9. The backend validates and stores the request, then broadcasts match updates.
10. The frontend updates ride options, estimated pricing, route details, and active matches.

## Core Screens

### Landing Section

The landing page should include:

- Animated brand introduction
- Rider CTA
- Driver CTA
- Short trust and performance signals
- Smooth transition into authentication or dashboard routes

### Authentication Portal

Registration fields:

- Name
- Email
- Phone number
- Password

Login fields:

- Email
- Password

Validation rules:

- Name is required
- Email must use a valid email format
- Phone number must be valid for the supported region
- Password must meet the configured minimum length
- Duplicate emails must be rejected by the backend
- Passwords must be hashed before storage

### Dashboard / Map View

The dashboard should include:

- Full-screen Leaflet map
- Search sidebar or bottom sheet depending on viewport size
- Pickup and drop-off autocomplete fields
- Marker placement for selected coordinates
- Ride options and matching panel
- Current ride status
- Accessible map controls and clear focus states

### Ride Match Panel

The ride match panel should display:

- Available matching rides
- Pickup and drop-off summary
- Estimated distance
- Estimated time
- Estimated fare
- Seat availability
- Driver or rider details where appropriate
- Ride request state: pending, matched, accepted, completed, cancelled

## Map And Geocoding

RideJunto uses Leaflet with OpenStreetMap tiles to avoid expensive paid map SDKs.

Recommended geocoding providers:

- Nominatim, for development and low-volume usage
- Photon, for free OpenStreetMap-based search
- Pelias, for self-hosted or production-controlled geocoding

Important production note: public Nominatim endpoints have usage policies and should not be abused. For production traffic, use caching, throttling, a compliant hosted provider, or a self-hosted geocoding service.

## API Endpoints

Base URL:

```text
/api
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Register request:

```json
{
  "name": "Avery Stone",
  "email": "avery@example.com",
  "phone": "+15551234567",
  "password": "secure-password"
}
```

Login request:

```json
{
  "email": "avery@example.com",
  "password": "secure-password"
}
```

Success response:

```json
{
  "success": true,
  "message": "Authenticated successfully",
  "user": {
    "id": "user_id",
    "name": "Avery Stone",
    "email": "avery@example.com"
  }
}
```

### Geolocation Search

```http
GET /api/geocode/search?q=central%20park
GET /api/geocode/reverse?lat=40.785091&lng=-73.968285
```

Search response:

```json
{
  "success": true,
  "results": [
    {
      "id": "osm-place-id",
      "label": "Central Park, New York, NY, USA",
      "lat": 40.785091,
      "lng": -73.968285
    }
  ]
}
```

Validation requirements:

- Query must be trimmed and sanitized
- Empty queries should return a validation error
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Search endpoints must be rate limited

### Rides

```http
POST /api/rides
GET  /api/rides/active
GET  /api/rides/history
GET  /api/rides/:id
PATCH /api/rides/:id/status
```

Create ride request:

```json
{
  "pickup": {
    "label": "Central Park, New York, NY, USA",
    "lat": 40.785091,
    "lng": -73.968285
  },
  "dropoff": {
    "label": "Times Square, New York, NY, USA",
    "lat": 40.758,
    "lng": -73.9855
  },
  "seats": 2
}
```

Create ride response:

```json
{
  "success": true,
  "message": "Ride request created",
  "ride": {
    "id": "ride_id",
    "status": "pending",
    "seats": 2,
    "estimatedDistanceKm": 4.2,
    "estimatedDurationMinutes": 18,
    "estimatedFare": 12.5
  }
}
```

## Real-Time Updates

RideJunto should trigger real-time ride match updates when:

- A new ride request is created
- A nearby driver becomes available
- A ride status changes
- Seat availability changes
- A ride is accepted, cancelled, or completed

Recommended implementation:

- Socket.IO for bidirectional ride matching events
- Server-Sent Events for simpler one-way updates

Example Socket.IO events:

```text
ride:created
ride:matched
ride:status-updated
ride:cancelled
driver:location-updated
```

## Validation And Security

Backend security requirements:

- Use `dotenv` for secrets and configuration
- Never commit real `.env` files
- Hash passwords with `bcrypt`
- Use JWTs with secure expiration or HTTP-only secure cookies
- Validate all request bodies
- Sanitize all text inputs
- Escape or reject unsafe HTML input
- Use `helmet` for secure HTTP headers
- Configure `cors` with explicit allowed origins
- Rate limit authentication and geocoding endpoints
- Validate latitude and longitude before storage or matching
- Store database credentials only in environment variables

Frontend validation requirements:

- Show clear inline errors for invalid fields
- Prevent ride submission if pickup or drop-off coordinates are missing
- Prevent ride submission if seat count is missing or invalid
- Keep autocomplete dropdowns keyboard accessible
- Do not let overlays block essential map controls

## Environment Variables

### Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DATABASE_URL=mongodb://127.0.0.1:27017/ridejunto
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

GEOCODE_PROVIDER=nominatim
GEOCODE_BASE_URL=https://nominatim.openstreetmap.org
GEOCODE_USER_AGENT=RideJunto/1.0 contact@example.com

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=(c) OpenStreetMap contributors
```

## Local Setup

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB or PostgreSQL

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

## Recommended Scripts

### Frontend

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

### Backend

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "lint": "eslint .",
  "test": "node --test"
}
```

## Accessibility Requirements

- Use semantic page regions: `header`, `main`, `section`, `nav`, and `form`
- Add labels for every form control
- Use `aria-label` on icon-only map controls
- Preserve keyboard navigation through autocomplete options
- Ensure visible focus styles
- Use sufficient color contrast for text, buttons, and map overlays
- Announce validation errors with accessible error text
- Avoid trapping users behind overlays or modals

## Performance Requirements

- Debounce autocomplete requests
- Cancel stale autocomplete requests with `AbortController`
- Cache repeated geocoding results where practical
- Avoid rerendering the full map on every keystroke
- Use stable container dimensions for map panels and controls
- Lazy load dashboard-only modules when possible
- Keep map markers and popup state isolated from unrelated UI state
- Use CSS transforms and opacity for smooth transitions

## Layout Rules

- Map should occupy the main viewport without hidden overflow issues
- Search dropdowns must render above the map layer using a controlled `z-index`
- Sidebars and bottom sheets must not cover required Leaflet controls
- Mobile layout should favor a bottom sheet over a fixed wide sidebar
- Popups should not be clipped by parent containers
- Buttons and input text must not overflow on small screens
- Use responsive Tailwind utilities rather than viewport-scaled font sizes

## Error Handling

The app should gracefully handle:

- Geocoding provider downtime
- Empty autocomplete results
- Invalid or unresolved coordinates
- Expired authentication sessions
- Network failures during ride submission
- Duplicate registration attempts
- Database connection failures
- Real-time socket disconnects

All API errors should return structured JSON:

```json
{
  "success": false,
  "message": "Unable to fetch location suggestions",
  "code": "GEOCODE_FAILED"
}
```

## Deployment

### Frontend

Recommended hosting:

- Vercel
- Netlify
- Cloudflare Pages

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Set production environment variables in the hosting dashboard:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_SOCKET_URL=https://api.your-domain.com
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Backend

Recommended hosting:

- Render
- Railway
- Fly.io
- AWS ECS
- DigitalOcean App Platform

Start command:

```bash
npm start
```

Production backend variables:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_secret
GEOCODE_PROVIDER=production_provider
GEOCODE_BASE_URL=your_geocode_url
GEOCODE_USER_AGENT=RideJunto/1.0 support@your-domain.com
```

### Database

MongoDB deployment options:

- MongoDB Atlas
- Railway MongoDB
- Render private database

PostgreSQL deployment options:

- Neon
- Supabase
- Railway PostgreSQL
- Render PostgreSQL

## Map Configuration Notes

OpenStreetMap tiles are suitable for development and moderate use, but production applications should review tile usage policies. For higher traffic, use a compliant tile provider or self-hosted tiles.

Production map options:

- OpenStreetMap with compliant caching and attribution
- MapTiler with free or low-cost tiers
- Stadia Maps
- Self-hosted raster tiles

Always display required attribution for the selected tile provider.

## Testing Checklist

- Registration rejects invalid email and phone formats
- Passwords are never stored as plain text
- Login returns a valid session or token
- Authenticated dashboard loads user details
- Autocomplete is debounced and rate limited
- Autocomplete dropdown overlays the map without layout breaks
- Selecting a suggestion places the correct marker
- Ride request fails when coordinates are missing
- Ride request succeeds with valid pickup, drop-off, and seats
- Ride history persists after refresh
- Real-time match updates appear without page reload
- Mobile search and ride panels do not block map controls
- Keyboard users can complete the full ride request flow

## Future Enhancements

- Driver availability mode
- Live driver location tracking
- Route drawing with OSRM
- Fare splitting
- Scheduled rides
- Push notifications
- Admin moderation dashboard
- In-app chat between matched users
- Payment integration
- Self-hosted geocoding and tile infrastructure

## License

Add the project license before production release.
