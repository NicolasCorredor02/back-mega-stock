import { Server } from "socket.io";

function socketConfig(server) {
  const io = new Server(server);

  // Evento de apertura de la conexion
  io.on("connection", (socket) => {
    console.log(`usuario ID: ${socket.id} conectado!`);

    // Envento para obtener el form data de producto y asi guardarlo en la DB
    socket.on("addProduct", (data) => {
      console.log("data form:", data);
    })


    // Evento para la desconexion del usuario o socket
    socket.on("disconnect", () => {
      console.log(`usuario ID: ${socket.id} desconectado`);
    })
  })
}

export default socketConfig
