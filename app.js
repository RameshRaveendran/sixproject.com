require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const connectDB = require('./src/config/db');
const { protect, adminOnly } = require('./src/middleware/authMiddleware');
const User = require('./src/models/User');

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// JWT Token verification middleware for views
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/login');
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

// Routes
app.get('/', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login');
});

app.get('/login', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { error: null });
});

app.get('/register', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', { error: null });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Protected Dashboard Route
app.get('/dashboard', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('user/userDashboard', { user: req.user });
});

// Admin Dashboard Route
app.get('/admin/dashboard', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('admin/adminDashboard', { user: req.user, users });
  } catch (error) {
    res.redirect('/login');
  }
});

// API Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', protect, userRoutes);
app.use('/api/admin', protect, adminOnly, adminRoutes);

// Delete user (admin only)
app.post('/admin/delete/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.redirect('/admin/dashboard');
    }
    if (userToDelete.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
