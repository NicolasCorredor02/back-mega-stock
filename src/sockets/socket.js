import CustomError from 'root/utils/customError.js'

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
    if (!io) throw new CustomError('Socket.io no initialized', 500)
    io.emit('addProduct', product)
  },

  emitUpdatedProduct: function (productUpdated) {
    if (!io) throw new CustomError('Socket.io not initilized', 500)
    io.emit('productUpdated', productUpdated)
  },

  emitDeletedProduct: function (productDeleted) {
    if (!io) throw new CustomError('Socket.io not initilized', 500)
    io.emit('productDeleted', productDeleted)
  },

  emitAddCart: function (cartAdded) {
    if (!io) throw new CustomError('Socket.io not initilized', 500)
    io.emit('cartAdded', cartAdded)
  },

  emitUpdatedCart: function (cartUpdated) {
    if (!io) throw new CustomError('Socket.io not initilized', 500)
    io.emit('cartUpdated', cartUpdated)
  },

  emitDeletedCart: function (cartDeleted) {
    if (!io) throw new CustomError('Socket.io not initilized', 500)
    io.emit('cartDeleted', cartDeleted)
  },

  emitSocketError: function (error) {
    if (!io) throw new CustomError('Socket.io no initialized', 500)
    io.emit('socketError', error)
  }
}
