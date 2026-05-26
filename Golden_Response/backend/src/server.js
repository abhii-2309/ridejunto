import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { registerRideSocket } from "./sockets/ride.socket.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true
  }
});

registerRideSocket(io);
await connectDatabase();

server.listen(env.port, () => {
  console.log(`RideJunto API running on http://localhost:${env.port}`);
});
