const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// @desc      Register a new user
// @route     POST /api/user
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email or password is missing.");
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }
  // Hash password
  const hashedPassword = await hashPassword(password);
  // Create user
  const user = await User.create({ email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// @desc      Authenticate a user
// @route     POST /api/user/login
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Unable to find an account with that email.");
  }
  // Check password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect password.");
  }
});

// @desc      Get user data
// @route     GET /api/user/me
// @access    Private
const getUser = asyncHandler(async (req, res) => {
  const { _id, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    email,
  });
});

// Hash a password
const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerUser, loginUser, getUser };
