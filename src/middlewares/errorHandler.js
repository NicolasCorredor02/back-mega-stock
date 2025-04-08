export const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  const errorMessage = error.message || 'An unknow error ocurred'
  const statusCode = error.status || 500
  res.status(statusCode).json({
    message: errorMessage
  })
}
