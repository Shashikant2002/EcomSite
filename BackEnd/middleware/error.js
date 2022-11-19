const ErrorHandeler = require("../utils/errorHandeler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong MongoDb id Error
  if (err.name === "CastError") {
    const message = `Resources Not Found. Invalid: ${err.path}`;
    err = new ErrorHandeler(message, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Deplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandeler(message, 400);
  }

  // Wrong JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandeler(message, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpireError") {
    const message = `Json Web Token is Expire, try again`;
    err = new ErrorHandeler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    maessage: err.message,
  });
};
