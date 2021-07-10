//const AppError = require('../utils/appError');

//Handle all developement based error
const sendErrorDev = (err, req, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendErrorDev(err, req, res);
};
