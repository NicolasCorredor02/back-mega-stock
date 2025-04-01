import multer from 'multer'
import CustomError from 'root/utils/customError.js'

export default function handleErrorUploads (error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new CustomError('Maximum 5 images per product', 413))
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new CustomError('Maximum size per image is 5MB', 413))
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(
        new CustomError("Only the 'thumbnails' field is allowed for image uploads", 400))
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(
        new CustomError("Only the 'newThumbnails' field is allowed for image uploads", 400))
    }
  }

  next(error)
}
