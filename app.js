require('dotenv').config();
// Initialize the Express application
const express = require('express');
const app = express();

// local file require
const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes");

// database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// main routes
app.use("/api/auth/",authRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
