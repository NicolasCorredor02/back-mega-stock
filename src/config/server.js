import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cookieParser from 'cookie-parser'
import routes from 'root/routes/index.js'
import passport from 'passport'
import path from 'path'
import logger from 'morgan'
import { errorHandler } from 'root/middlewares/errorHandler.js'
import handlebarsConfig from 'root/config/handlebars.js'
import { rootPath } from 'root/utils/paths.js'
import { socketModule } from 'root/sockets/socket.js'
// import { connectDB } from 'root/daos/mongodb/connection.js'
// Strategies
import 'root/config/passport/googleStrategy.js'
import 'root/config/passport/jwtStrategy.js'

const serverUp = async () => {
  const app = express()
  const server = createServer(app) // Se levanta el server para socket.io
  const io = new Server(server) // Creacion del io para el acceso al socket del server

  // Conexion a la base de datos
  // connectDB()

  //* SETEO handlebars
  handlebarsConfig(app)

  //* Middlewares
  app.use(express.json()) // Ingreso de data por el body de HTTP
  app.use(express.urlencoded({ extended: true })) // Ingreso de data de forms que sean extensos y requieran una inspeccion profunda
  app.use(cookieParser()) // Middleware para el manejo de cookies
  app.use(passport.initialize()) // Inicializar passport para trabajar en todas las rutas
  app.use(logger('dev'))

  //* Middlewares para archivos static
  app.use('/static', express.static(path.resolve(rootPath, 'public'))) // Implementacion de middleware para establecer un directorio static que alojara los archivos public para el render desde server
  app.use('/uploads', express.static(path.resolve(rootPath, 'uploads'))) // Implementacion para establecer directorio estatico de las imagenes que se suben

  //* CORS
  // Config de los dominios que pueden acceder a la API
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // Publica
    res.header('Access-Control-Allow-Headers', 'Content-Type') // Enviar diferentes content-type
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') // Metodos permitidos
    next() // Middleware para no frenar la ejecucion de la API y en cambio se siguen ejecutando los demas middlewares
  })

  //* Implementacion de socket.io
  socketModule.init(io)

  //* Routes o endpoints
  app.use('/', routes)

  app.use(errorHandler) // Middleware propio para el manejo global de errores

  return server
}

export default serverUp
