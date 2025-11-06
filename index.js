require('dotenv').config();
const express = require('express');
const { PORT } = require('./constants/app');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth.route');

// create the express application
const app = express();

// Connect to database
connectToDB();

// Add middleware to parse JSON
app.use(express.json());

// Handle routing
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
