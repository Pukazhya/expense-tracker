const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const authResponse = (user) => ({ token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' }), user: { id: user._id, name: user.name, email: user.email } });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    res.status(201).json(authResponse(user));
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select('+password');
    if (!user || !password || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json(authResponse(user));
  } catch (error) { next(error); }
});

module.exports = router;
