const { verifyToken } = require('../utils/jwt');
const response = require('../utils/response');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the request header
    const authHeader = req.headers['authorization'];

    // Get the token from the request header or from cookie
    const tokenFromHeader = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
    const token = tokenFromHeader || req.cookies?.token;

    // check if token is not provided
    if (!token) response(res, 401, 'Authentication token missing');

    let decodedToken;
    try {
      decodedToken = verifyToken(token);
    } catch (err) {
      return response(res, 401, 'Invalid or expired token');
    }

    const user = await User.findById(decodedToken.id).select('-password');
    if (!user) return response(res, 401, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    next(err);
  }
};

module.exports = authMiddleware;
