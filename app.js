require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();

// Database connection
const connectDB = require('./src/config/db');
connectDB();

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Routes for rendering pages
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  }
  res.render("auth/login");
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  }
  res.render("auth/login");
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  }
  res.render("auth/register");
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// API routes
app.use("/api/auth/", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Dashboard routes (protected)
app.get('/user/dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'user') {
    req.flash('error_msg', 'Please login to access dashboard');
    return res.redirect('/login');
  }
  res.render('user/userDashboard', { user: req.session.user });
});

app.get('/admin/dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error_msg', 'Admin access required');
    return res.redirect('/login');
  }
  
  try {
    const User = require('./src/models/User');
    const users = await User.find().select('-password');
    res.render('admin/adminDashboard', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error_msg', 'Error fetching users');
    res.redirect('/login');
  }
});

// Delete user route (admin only)
app.delete('/api/admin/user/:id', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error_msg', 'Admin access required');
    return res.redirect('/login');
  }

  try {
    const User = require('./src/models/User');
    const userToDelete = await User.findById(req.params.id);
    
    if (!userToDelete) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/dashboard');
    }

    if (userToDelete.role === 'admin') {
      req.flash('error_msg', 'Cannot delete admin users');
      return res.redirect('/admin/dashboard');
    }

    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error_msg', 'Error deleting user');
    res.redirect('/admin/dashboard');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
