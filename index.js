require('dotenv').config()
const express = require('express');
const { PORT } = require('./constants/app');
// create the express application
const app = express();

// Add middleware to parse JSON
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
