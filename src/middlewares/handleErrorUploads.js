import createHttpError from "http-errors";
import multer from "multer";

export default function handleErrorUploads(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_COUNT") {
      return next(createHttpError(413, "Maximum 5 images per product"));
    }
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(createHttpError(413, "Maximum size per image is 5MB"));
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        createHttpError(400, "Only the 'thumbnails' field is allowed for image uploads"));
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        createHttpError(400, "Only the 'newThumbnails' field is allowed for image uploads"));
    }
  }

  next(error);
}
