const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

// @route  POST /api/auth/signup
// @desc   Register new user
// @access Public
router.post('/signup', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}));

// @route  POST /api/auth/login
// @desc   Login user
// @access Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}));

// @route  GET /api/auth/me
// @desc   Get current user
// @access Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
}));

// @route  PUT /api/auth/profile
// @desc   Update profile
// @access Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    if (req.body.password.length < 6) { res.status(400); throw new Error('Password too short'); }
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({
    token: generateToken(updated._id),
    user: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role },
  });
}));

module.exports = router;
