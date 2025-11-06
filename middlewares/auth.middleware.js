const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the request header
  const authHeader = req.headers['authorization'];

  // Get the token from the request header
  const token = authHeader && authHeader.split(' ')[1];
  // if there is no token return error
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied, no token provided. Please log in to continue',
    });
  }
  // try-catch...
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Access denied, Invalid token provided. Please log in to continue',
    });
  }
};
