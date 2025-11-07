require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./database/db');
const { PORT } = require('./constants/app');

const start = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await connectDB(MONGO_URI);

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // graceful shutdown
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down');
      server.close(() => process.exit(0));
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down');
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
