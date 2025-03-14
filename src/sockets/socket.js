let io

export const socketModule = {
  init: function (socketio) {
    io = socketio
    // Evento de apertura de la conexion
    io.on('connection', (socket) => {
      console.log(`user ID: ${socket.id} connected!`)

      // Evento para la desconexion del usuario o socket
      socket.on('disconnect', () => {
        console.log(`user ID: ${socket.id} disconnected`)
      })
    })
    return io
  },

  emitAddProduct: function (product) {
    if (!io) {
      throw new Error('Socket.io no initialized')
    }
    io.emit('addProduct', product)
  },

  emitUpdatedProduct: function (productUpdated) {
    if (!io) {
      throw new Error('Socket.io not initilized')
    }
    io.emit('productUpdated', productUpdated)
  },

  emitDeletedProduct: function (productDeleted) {
    if (!io) {
      throw new Error('Socket.io not initilized')
    }
    io.emit('productDeleted', productDeleted)
  },

  emitSocketError: function (error) {
    if (!io) {
      throw new Error('Socket.io no initialized')
    }
    io.emit('socketError', error)
  }
}
