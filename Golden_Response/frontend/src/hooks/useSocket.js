import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useSocket(user, onRideEvent) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("ride:join", user.id);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("ride:created", onRideEvent);
    socket.on("ride:matched", onRideEvent);
    socket.on("ride:status-updated", onRideEvent);

    return () => {
      socket.disconnect();
    };
  }, [user, onRideEvent]);

  return connected;
}
