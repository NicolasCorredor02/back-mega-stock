import express from "express";
import routes from "root/routes/index.js";
import logger from "morgan";
import errorHandler from "root/middlewares/errorHandler.js";
import path from "path";

const createServer = () => {
  const app = express();
  const srcPath = path.resolve("./src/"); // Patg que apunta a la ruta raiz del proyecto

  //* Middlewares
  app.use(express.json()); // Ingreso de data por el body de HTTP
  app.use(express.urlencoded({ extended: true })); // Ingreso de data de forms que sean extensos y requieran una inspeccion profunda
  app.use(logger("dev"));
  app.use("/uploads", express.static(path.join(srcPath, "uploads"))); // Implementacion para establecer directorio estatico de las imagenes que se suben
  
  //* CORS
  // Config de los dominios que pueden acceder a la API
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Publica
    res.header("Access-Control-Allow-Headers", "Content-Type"); // Enviar diferentes content-type
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Metodos permitidos
    next(); // Middleware para no frenar la ejecucion de la API y en cambio se siguen ejecutando los demas middlewares
  });

  //* Routes o endpoints
  app.use("/", routes);

  // todo Route not found

  app.use(errorHandler); // Middleware propio para el manejo global de errores
  return app;
};

export default createServer;
