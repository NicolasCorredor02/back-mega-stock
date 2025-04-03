import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { cloudinary } from 'root/config/cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { pathImagesProducts, pathImagesUsers } from 'root/utils/paths.js'

// Configuracion de folders dinamicos para users y products
const generateCloudinaryParams = (folderPath) => (req, file) => ({
  folder: folderPath,
  public_id: `${uuidv4()}_${path.parse(file.originalname).name}`,
  allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
  resource_type: 'auto'
})

// Configuración de almacenamiento de uploads para users
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: generateCloudinaryParams(pathImagesUsers)
})

// Configuracion de almacenamiento de uplodas para products
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: generateCloudinaryParams(pathImagesProducts)
})

// Tipos de archivos permitidos
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Middlewares de multer configurados
export const uploadUserImages = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed (JPEG, JPG, PNG, WEBP)'), false)
    }
  }
}).single('profileImage', 1) // Campo para imagenes de usuario max 1

export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed (JPEG, JPG, PNG, WEBP)'), false)
    }
  }
}).array('thumbnails', 5) // Campo para las imagenes de los productos max 5
