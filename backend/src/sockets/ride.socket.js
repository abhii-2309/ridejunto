let ioInstance;

export function registerRideSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("ride:join", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });
  });
}

export function emitRideUpdate(event, payload) {
  if (!ioInstance) return;
  ioInstance.emit(event, payload);

  if (payload?.ride?.user) {
    ioInstance.to(`user:${payload.ride.user}`).emit(event, payload);
  }
}
