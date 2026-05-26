RideJunto — Full Stack Ride Sharing Platform
Context and Role
You are a full stack developer specializing in high performance, location aware web applications. Your responsibility is to design and build RideJunto, a production grade ride sharing platform that connects drivers and riders through real time location matching, interactive mapping, and a clean, fast interface.
The platform must handle dynamic geospatial data, authenticated user sessions, and live ride coordination - all while staying responsive, accessible, and cost effective (no paid map APIs).

Objective
Build a complete full stack ride sharing web application that:
Deliver an interactive, cost free mapping experience using Leaflet and Open Street Map.
Provides a modern, responsive UI with smooth transition and zero layout conflicts.
Includes functional location search with free autocomplete (Nominatim / Photon).
Supports secure user authentication and session management.
Logs ride requests and matches persistently in a database.
Returns real time ride availability with estimated pricing and travel time.

Input Data / Feature Requirements
Required Screens
The platform must implement the following views:
Landing / Hero Section
Animated introduction with clear CTAs for drivers and riders.
Brief value proposition and feature highlights.
Authentication Portal
Registration and login forms with validation.
JWT or session based authentication.
Secure password hashing (bcrypt).
Dashboard / Map View
Full screen interactive map (Leaflet + OpenStreetMap).
Sidebar panel for ride search and results.
Map markers for pickup, drop off, and available drivers.
No overlapping UI elements or blocked map controls.
Location Autocomplete Search
Free tier autocomplete using Nominatim or Photon API.
Dropdown renders above the map layer without layout breaks.
Selecting a result places a marker and updates map bounds.
Ride Options / Match Panel
List of available rides matching the requested route.
Each result shows: driver name, ETA, seats available, estimated fare.
One tap booking confirmation.
Form Fields
User Registration
Field
Validation
Full Name
Required, min 2 characters
Email
Required, valid format
Phone Number
Required, numeric, 10–13 digits
Password
Required, min 8 characters, hashed on save

Ride Request
Field
Validation
Pickup Location
Required, must resolve to coordinates
Drop-off Location
Required, must resolve to coordinates
Number of Seats
Required, integer 1–6
Ride Type
Required (economy / shared / premium)


Data Processing Requirements
Resolve all location inputs to {lat,lng} before storing or querying.
Validate that latitude falls within [-90, 90] and longitude within [-180, 180].
Sanitize all user inputs to prevent XSS and injection attacks.
Hash passwords using bcrypt with a minimum salt round of 10.
Calculate estimated fare based on Haversine distance between coordinates.
Rate limit autocomplete endpoint to prevent Nominatim abuse.
Return all API responses as structured JSON:
json
// Success
{"status":"success","data": { ... }}

// Error
{"status":"error","message":"Descriptive error message","code": 400}

Output Requirements
The completed application must deliver:
A smooth, fully interactive ride sharing experience from login to booking confirmation.
Overlap free location autocomplete that cleanly layers above the map.
Ride match results with route visualization drawn on the map.
Booking confirmation screen shown to the user immediately after a successful match.
Persistent ride history accessible from the user dashboard.
Graceful degradation when map services or autocomplete APIs are unreachable.
Email / Notification 
On successful booking, trigger an email to both driver and rider containing:
Pickup and drop off addresses
Driver / rider name and contact
Estimated fare and ETA
Timestamp

Error Handling
Frontend
Display inline validation errors per field before submission.
Show a dismissible banner for network or API failures.
If map tiles fail to load, display a fallback message with a retry option.
If autocomplete returns no results, display “No locations found. Try a different search.”
Backend
Return 400 for invalid or missing input fields with field specific error details.
Return 401 for unauthenticated requests to protected routes.
Return 404 when a ride or user record does not exist.
Return 429 when rate limits are exceeded on the autocomplete endpoint.
Return 500 for unexpected server failures with a sanitized message (never expose stack traces in production).
Log all backend failures with timestamp, route, error message, and request payload.
Documentation Requirements
Provide complete documentation covering:
Frontend and backend folder structure.
Step by step local setup instructions.
Full list of environment variables with descriptions.
Deployment steps (e.g., Railway, Render, or Vercel + separate API).
Map provider configuration notes (Nominatim usage policy, Photon as alternative).

Performance and Scalability
Lazy load map component to reduce initial bundle size.
Debounce autocomplete input at 300ms to avoid excessive API calls.
Use useMemo / useCallback where applicable to prevent unnecessary re-renders.
Avoid layout thrashing during map updates — batch DOM changes.
Only use GPU friendly CSS properties (transform, opacity) for animations.
Index database fields on userId, status, and createdAt for fast query performance.
Paginate ride history results (default page size: 20).
Support horizontal API scaling via stateless JWT authentication (no server side sessions).
Apply helmet.js and CORS restrictions on all Express routes.

Technology Stack
Layer
Technology
Frontend
React, JavaScript, Tailwind CSS
Mapping
Leaflet.js, OpenStreetMap tiles
Autocomplete
Nominatim API (Photon as fallback)
Backend
Node.js, Express
Authentication
JWT + bcrypt
Database
MongoDB (Mongoose) or PostgreSQL (Prisma)
Email (optional)
Nodemailer with SMTP or Resend API
Config / Security
dotenv, helmet.js, express rate limit
Dev Tooling
ESLint, Prettier, Nodemon


