require('dotenv').config();
// Initialize the Express application
const express = require('express');
const app = express();

// local file require
const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");


// database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");


// Routes test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// main routes
app.use("/api/auth/",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
