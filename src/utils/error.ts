class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong!",
  });
};

export  { AppError, errorHandler };
