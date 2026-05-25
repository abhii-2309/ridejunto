# RideJunto Deployment

## Frontend

Deploy `frontend` to Vercel, Netlify, or Cloudflare Pages.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required variables:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_SOCKET_URL=https://api.your-domain.com
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=(c) OpenStreetMap contributors
```

## Backend

Deploy `backend` to Render, Railway, Fly.io, or another Node.js host.

Start command:

```bash
npm start
```

Required variables:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
DATABASE_URL=your_database_url
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
GEOCODE_BASE_URL=https://nominatim.openstreetmap.org
GEOCODE_USER_AGENT=RideJunto/1.0 support@your-domain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```
