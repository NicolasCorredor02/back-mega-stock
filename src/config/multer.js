import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid"

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Carpeta destino
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName); // Nombre unico: codigo unico + extension del archivo
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (JPEG, PNG, WEBP)"), false);
  }
};

// Configuración final de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite: 5MB
});

export default upload;