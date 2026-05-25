# RideJunto Full-Stack Application Prompt

## Context And Role

You are a full-stack developer working on modern web experiences. Your task is to build RideJunto, a high-performance ride sharing web application.

RideJunto must provide cost-effective mapping while remaining responsive, accessible, secure, and production grade. The platform should guide users through a smooth visual journey from location selection to ride matching. It must also include functional authentication and ride management features that collect user information and handle location data dynamically.

## Objective

Develop a complete full-stack ride sharing web application that:

- Implements an interactive, cost-effective mapping system.
- Provides a modern, responsive UI with smooth transitions and zero layout overlaps.
- Includes functional location search with free autocomplete services.
- Logs user accounts and ride details securely.
- Triggers real-time updates for ride sharing matches.

## UI And Animation Requirements

### Layout And Mapping Experience

- Implement interactive maps without relying on expensive paid API keys.
- Use smooth UI transitions for panel overlays, search bars, and map popups.
- Ensure map controls and absolutely positioned elements do not overlap or block user interactions.
- Include smooth transitions between application states.

### Required Screens

The ride sharing platform must include:

- **Hero / Landing Section:** Animated introduction to the app with clear calls to action for drivers and riders.
- **Authentication Portal:** Secure login and registration flows.
- **Dashboard / Map View:** Central hub featuring full-screen map rendering and a search sidebar.
- **Location Autocomplete Search:** Input fields that provide instant, free location suggestions.
- **Ride Options / Match Panel:** Available rides, routes, estimated pricing, and estimated travel times.

## Responsiveness And Performance

The layout must be:

- Fully responsive and mobile-first for users on the go.
- Accessible, with semantic HTML and ARIA labels for map controls.
- Optimized for performance to prevent layout thrashing during dynamic map updates.

## System Requirements

### Location Search And Autocomplete Behavior

Interacting with search fields must:

- Dynamically fetch location suggestions based on user input.
- Render an autocomplete dropdown that overlays cleanly above the map layer.
- Avoid breaking the layout or blocking map controls.
- Update the map view and place markers on selected coordinates.

### Core Form Fields

User registration must collect:

- Name
- Validated email
- Validated phone number
- Secured password

Ride requests must collect:

- Pickup location, required
- Drop-off location, required
- Number of seats, required

### Validation

- Provide client-side validation with clear error messages.
- Show errors for missing locations or incorrect inputs.
- Prevent ride submission if location coordinates fail to resolve.

## Backend Requirements

### API Endpoints

Implement backend endpoints to:

- Handle user authentication and session management.
- Fetch and parse address autocomplete data.
- Securely log ride histories and active requests in a database.
- Return structured JSON success and error responses.

### Configuration And Security

- Store database credentials and API URLs in environment variables.
- Use `dotenv` for environment configuration.
- Prevent spam or API abuse with basic rate limiting on search endpoints.
- Sanitize all inputs to prevent XSS and injection attacks.
- Validate latitude and longitude formats before querying or storing data.

## Output And Documentation Requirements

### Deliverables

The final application must include:

- A smooth, interactive ride sharing web application.
- Functional, overlap-free location autocomplete and mapping.
- Graceful error handling when map services or backend routes fail.
- Secure authentication and ride management.

### Documentation

Provide complete documentation detailing:

- Frontend and backend folder structure.
- Setup instructions.
- Environment variable configuration.
- Deployment steps for hosting the application.
- Map configuration and provider notes.

## Required Technology Stack

- **Frontend:** React, JavaScript, Tailwind CSS
- **Mapping:** Leaflet, OpenStreetMap
- **Backend:** Node.js, Express
- **Configuration And Security:** dotenv
- **Database:** MongoDB or PostgreSQL recommended for storing user profiles and ride data
