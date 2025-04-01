export const errorHandler = (error, req, res, next) => {
  console.error(error)
  const errorMessage = error.errorMessage || 'An unknow error ocurred'
  const statusCode = error.status || 500
  res.status(statusCode).json({
    message: errorMessage
  })
}
