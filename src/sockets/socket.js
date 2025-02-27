let io;

export const socketModule = {
  init: function (socketio) {
    io = socketio;
    return io;
  },

  emitAddProduct: function (product) {
    if (!io) {
      throw new Error("Socket.io no initialized");
    }
    io.emit("addProduct", product);
  },

  emitSocketError: function (error) {
    if (!io) {
      throw new Error("Socket.io no initialized");
    }
    io.emit("socketError", error);
  },
};
