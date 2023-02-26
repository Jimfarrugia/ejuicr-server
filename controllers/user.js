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

// @desc      Create and send a reset password token
// @route     POST /api/user/reset-password
// @access    Private
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // Check user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Unable to find an account with that email.");
  }
  const { id } = user;
  // Generate reset password token
  const token = generateResetPasswordToken(user.id);
  // TODO - Send the token via email

  res.status(200).json({
    id,
    email,
    token,
  });
});

// @desc      Get user data
// @route     GET /api/user/me
// @access    Private
const updatePassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const decodedToken = validateToken(token);
  const { id } = decodedToken;
  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(404);
    throw new Error("Unable to find user account.");
  }
  if (!password || password.length < 6 || password.length > 250) {
    res.status(400);
    throw new Error("Password is missing or invalid.");
  }
  const hashedPassword = await hashPassword(password);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );
  res.status(200).json({
    updatedUser,
  });
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

// Generate a login token
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Generate a reset password token
const generateResetPasswordToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Validate a reset password token
const validateToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400);
      throw new Error("Invalid or expired token.");
    }
    return decoded;
  });
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getUser,
  updatePassword,
};
