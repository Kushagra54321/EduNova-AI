const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, age } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      gender: gender || 'Prefer not to say',
      age: age || null,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Guest Login
// @route   POST /api/auth/guest-login
// @access  Public
const guestLogin = async (req, res) => {
  try {
    const guestEmail = 'guest@edunova.ai';
    let user = await User.findOne({ email: guestEmail });

    if (!user) {
      // Create guest user on the fly if it doesn't exist
      user = await User.create({
        name: 'Guest User',
        email: guestEmail,
        password: 'secureguestpassword123', // Dummy password
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isGuest: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto Login bypass
// @route   POST /api/auth/auto-login
// @access  Public
const autoLogin = async (req, res) => {
  try {
    const targetEmail = 'kushagrasingh54321@gmail.com';
    const targetPassword = '123kush';
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      // Create user if they don't exist yet
      user = await User.create({
        name: 'Kushagra Singh',
        email: targetEmail,
        password: targetPassword,
      });
    }

    // Normally we compare passwords, but since this is an auto-login explicitly requested:
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, resetPassword, guestLogin, autoLogin };
