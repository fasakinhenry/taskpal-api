const response = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return response(res, status, message);
};

module.exports = errorMiddleware;
