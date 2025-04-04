import mongoose from 'mongoose'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'

dotenv.config() // Se cargan las variables de entorno a traves de dotenv

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'MegaStock', // Nombre de la DB
      useNewUrlParser: true, // En v6+ es por defecto
      useUnifiedTopology: true // Mantener para versiones antiguas
    })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('Conexion error:', error.message)
    process.exit(1) // Forzar la salida en caso de error
  }
}

const ttlSeconds = 180

const StoreOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: ttlSeconds
  }),
  secret: process.env.MONGO_STORE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * ttlSeconds
  }
}

export { connectDB, StoreOptions }
