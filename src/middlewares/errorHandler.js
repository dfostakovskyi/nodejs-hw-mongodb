//src\middlewares\errorHandler.js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  const errorDetails = err.details || null;
  res.status(status).json({
    status,
    message,
    ...(errorDetails && { details: errorDetails }),
  });
};

export default errorHandler;
