const GLOBAL_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const GLOBAL_REQUEST_PER_MINUTE = 100;
const ALLOWED_FILE_UPLOAD_EXTENSIONS = ['png', 'jpeg', 'jpg'];
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MORGAN_CONFIG = IS_PRODUCTION
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  : 'dev';

const PORT = process.env.PORT || 2800;

// JWT specific constants
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'replace_this_with_a_strong_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2d'; // 2 days
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

module.exports = {
  GLOBAL_RATE_LIMIT_WINDOW_MS,
  GLOBAL_REQUEST_PER_MINUTE,
  ALLOWED_FILE_UPLOAD_EXTENSIONS,
  MAX_FILE_SIZE,
  IS_PRODUCTION,
  MORGAN_CONFIG,
  PORT,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
};
