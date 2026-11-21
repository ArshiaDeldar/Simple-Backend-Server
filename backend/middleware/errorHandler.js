function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Duplicate unique value
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "A record with this value already exists",
    });
  }

  // Requested record doesn't exist
  if (err.code === "P2025") {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? "Internal Server Error" : err.message;
  res.status(statusCode).json({
    message,
  });
}

export default errorHandler;
