function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || "Internal server error.",
  };

  if (err.fields) {
    response.fields = err.fields;
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json(response);
}

export default errorHandler;
