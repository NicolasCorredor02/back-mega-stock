import mongoose from 'mongoose'
import 'dotenv/config'

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

export { connectDB }
