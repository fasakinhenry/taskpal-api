const express = require('express');

// create the express application
const app = express();

// Add middleware to parse JSON
app.use(express.json());

// setup port and server
const PORT = process.env.PORT || 2800;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
