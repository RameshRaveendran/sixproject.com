const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/register');
    }

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error_msg', 'User already exists');
      return res.redirect('/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    req.flash('success_msg', 'Registration successful! Please login.');
    res.redirect('/login');

  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'Server error during registration');
    res.redirect('/register');
  }
};

// Login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      req.flash('error_msg', 'Email and password required');
      return res.redirect('/login');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Create session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success_msg', 'Login successful!');
    
    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/user/dashboard');
    }

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'Server error during login');
    res.redirect('/login');
  }
};

// Logout controller
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('connect.sid');
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/');
  });
};

module.exports = {
  registerUser,
  loginUser,
  logout
};