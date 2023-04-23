const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const base64url = require("base64url");
const mailer = require("../services/mailer");
const User = require("../models/user");
const Recipe = require("../models/recipe");

// @desc      Register a new user
// @route     POST /api/user
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email or password is missing.");
  }
  // Hash password
  const hashedPassword = await hashPassword(password);
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.password) {
      res.status(400);
      throw new Error("User already exists.");
    } else {
      // Add a password for the user
      await User.updateOne({ email }, { password: hashedPassword });
      return res.status(201).json({
        _id: existingUser.id,
        email: existingUser.email,
        token: generateToken(existingUser._id),
      });
    }
  }
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
  // Check for non-existent password (OAuth users)
  if (!user.password) {
    res.status(400);
    throw new Error(
      `Sign in with ${capitalizeFirstLetter(
        user.authProvider
      )} instead or sign up using this email to add a password.`
    );
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
// @access    Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Unable to find an account with that email.");
  }
  // Generate token & encode it in a url-safe base64 format
  const token = generateResetPasswordToken(user.id);
  const encodedToken = base64url.encode(token);
  // Compose email
  const link = process.env.CLIENT_URL + "/update-password/" + encodedToken;
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Reset Password",
    text:
      "Click the link below to set a new password:\n\n" +
      link +
      "\n\nThis link will expire in 1 hour." +
      "\n\nIf you did not request a password reset, please ignore this message." +
      "\n\nRegards,\nejuicr",
  };
  // Send email
  try {
    const info = await mailer.sendMail(mailOptions);
    res.status(200).json({
      info,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Failed to send reset password email.");
  }
});

// @desc      Update the user's password using a reset token
// @route     GET /api/user/reset-password/:token
// @access    Public
const updatePassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const decodedToken = validateToken(base64url.decode(token));
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
  res.status(200).json({ updatedUser });
});

// @desc      Update the user's password using the current password
// @route     GET /api/user/change-password
// @access    Private
const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  const { user } = req;
  if (!user) {
    res.status(404);
    throw new Error("Unable to find user account.");
  }
  if (!newPassword || newPassword.length < 6 || newPassword.length > 250) {
    res.status(400);
    throw new Error("New password is missing or invalid.");
  }
  // Check current password
  if (await bcrypt.compare(password, user.password)) {
    // update the password
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } else {
    res.status(400);
    throw new Error("Incorrect password.");
  }
});

// @desc      Get user data
// @route     GET /api/user/me
// @access    Private
const getUser = asyncHandler(async (req, res) => {
  const { _id, authProvider, email, handle, displayName, picture, password } =
    req.user;
  res.status(200).json({
    _id,
    authProvider,
    email,
    handle,
    displayName,
    picture,
    hasPassword: password ? true : false,
  });
});

// @desc      Delete a user and all of their recipes
// @route     DELETE /api/user
// @access    Private
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  await Recipe.deleteMany({ author: _id });
  await User.findByIdAndDelete(_id);
  res.status(200).send("Account successfully deleted.");
});

// Hash a password
const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Generate a login token
const generateToken = _id => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getUser,
  updatePassword,
  changePassword,
  deleteUser,
};
