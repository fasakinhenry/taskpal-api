const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  IS_PRODUCTION,
} = require('../constants/app');

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

// cookie options for token
const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'none' : 'lax', // when deployed cross-domain, frontend should be on https and sameSite none
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days in ms
};

module.exports = {
  signToken,
  verifyToken,
  cookieOptions,
};
