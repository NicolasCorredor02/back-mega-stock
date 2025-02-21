import createHttpError from "http-errors";

export default function erroHandler(error, req, res, next) {
  console.error(error);
    let errorMessage = "An unknow error ocurred";
    let statusCode = 500;
    if (createHttpError.isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message
    }
    res.status(statusCode).json({
        error: errorMessage
    })
}
