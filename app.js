const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const response = require('./utils/response');
const {
  GLOBAL_RATE_LIMIT_WINDOW_MS,
  GLOBAL_REQUEST_PER_MINUTE,
  IS_PRODUCTION,
  MORGAN_CONFIG,
} = require('./constants/app');

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS - configure for SPA with credentials
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    exposedHeaders: ['Authorization'],
  })
);

// logging
app.use(morgan(MORGAN_CONFIG));

// global rate limiter
const limiter = rateLimit({
  windowMs: GLOBAL_RATE_LIMIT_WINDOW_MS,
  max: GLOBAL_REQUEST_PER_MINUTE,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  statusCode: 429,
});

app.use(limiter);

// Base route
app.get('/', (req, res) => response(res, 200, 'TaskPal API is running'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => response(res, 404, 'Route not found'));

// Error handler
app.use(errorMiddleware);

module.exports = app;
