const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const base64url = require("base64url");
const User = require("../models/user");

//* Protect a route by requiring the user's token from the request headers
// If the token is found, call next middleware
// Else throw a 401 error.
const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      const token = req.headers.authorization.split(" ")[1];
      // Decode token from url-safe base64
      const decodedToken = base64url.decode(token);
      // Verify token
      const verifiedToken = jwt.verify(decodedToken, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await User.findById(verifiedToken.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized - no token.");
  }
});

module.exports = { protect };
