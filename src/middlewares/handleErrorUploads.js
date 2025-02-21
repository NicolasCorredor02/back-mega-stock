import createHttpError from "http-errors";
import multer from "multer";

export default function handleErrorUploads(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(createHttpError(413, "Maximum size per image is 5MB"));
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return next(createHttpError(413, "Maximum 5 images per product"));
    }
  }

  next(error);
}
