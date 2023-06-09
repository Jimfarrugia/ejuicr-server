const express = require("express");
const passport = require("passport");
const router = express.Router();
const base64url = require("base64url");
const CLIENT_URL = process.env.CLIENT_URL;

// Google OAuth authentication route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: false,
  }),
  (req, res) => {
    // redirect the user to the react app with the token in the query parameters
    const urlSafeToken = base64url.encode(req.user);
    const redirectURL = `${CLIENT_URL}/?token=${urlSafeToken}`;
    res.redirect(redirectURL);
  }
);

// Google OAuth failure route
router.get("/google/failure", (req, res) => {
  res.status(500);
  throw new Error("Failed to authenticate with Google.");
});

// Twitter OAuth authentication route
router.get("/twitter", passport.authenticate("twitter"));

// Twitter OAuth callback route
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/twitter/failure",
    session: false,
  }),
  (req, res) => {
    // redirect the user to the react app with the token in the query parameters
    const urlSafeToken = base64url.encode(req.user);
    const redirectURL = `${CLIENT_URL}/?token=${urlSafeToken}`;
    res.redirect(redirectURL);
  }
);

// Twitter OAuth failure route
router.get("/twitter/failure", (req, res) => {
  res.status(500);
  throw new Error("Failed to authenticate with Twitter.");
});

module.exports = router;
