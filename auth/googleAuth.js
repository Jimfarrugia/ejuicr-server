const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

//* Configure the Google OAuth 2.0 authentication strategy
module.exports = passport => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      },
      asyncHandler(async (accessToken, refreshToken, profile, done) => {
        try {
          // Look for the user in the database using their Google profile ID and email (match either)
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });
          if (!user) {
            // If the user doesn't exist, create a new user document with their Google profile information
            user = new User({
              authProvider: "google",
              email: profile.emails[0].value,
              googleId: profile.id,
              displayName: profile.displayName,
              picture:
                (profile._json && profile._json.picture) ||
                profile.photos[0] ||
                "",
            });
            await user.save();
          } else {
            // If the user already exists, update their user document with their latest Google profile information
            user.authProvider = "google";
            user.googleId = profile.id;
            user.displayName = profile.displayName;
            user.picture =
              (profile._json && profile._json.picture) ||
              profile.photos[0] ||
              "";
            await user.save();
          }
          const { _id } = user;
          // Generate a JWT token with the users id and profile data
          const token = jwt.sign({ _id }, JWT_SECRET);
          done(null, token);
        } catch (err) {
          done(err);
        }
      })
    )
  );
};
