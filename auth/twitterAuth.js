const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

//* Configure the Twitter OAuth 1.0a authentication strategy
module.exports = passport => {
  passport.use(
    "twitter",
    new TwitterStrategy(
      {
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "/auth/twitter/callback",
      },
      asyncHandler(async (accessToken, accessTokenSecret, profile, done) => {
        try {
          // Load the node-fetch module dynamically using import()
          const fetch = await import("node-fetch");

          // Make a request to the Twitter API to get the user's email address
          const response = await fetch.default(
            "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const { email: twitterEmail } = await response.json();

          // Convert the user's profile image to a data URL
          // (otherwise firefox will prevent the remote image from loading if content blocking is enabled)
          const imageResponse = await fetch.default(
            profile._json.profile_image_url_https
          );
          const imageBuffer = await imageResponse.buffer();
          const imageDataUrl = `data:${imageResponse.headers.get(
            "content-type"
          )};base64,${imageBuffer.toString("base64")}`;

          // Look for the user in the database using their Twitter ID and email address (match either)
          let user = await User.findOne({
            $or: [{ twitterId: profile.id }, { email: twitterEmail }],
          });

          if (!user) {
            // If the user doesn't exist, create a new user document with their Twitter profile information
            user = new User({
              authProvider: "twitter",
              email: twitterEmail,
              twitterId: profile.id,
              displayName: profile.displayName,
              handle: profile.username,
              picture: imageDataUrl,
            });
            await user.save();
          } else {
            // If the user already exists, update their user document with their latest Twitter profile information
            user.authProvider = "twitter";
            user.twitterId = profile.id;
            user.displayName = profile.displayName;
            user.handle = profile.username;
            user.picture = imageDataUrl;
            await user.save();
          }
          const { _id, authProvider, email, handle, displayName, picture } =
            user;
          // Generate a JWT token with the users id and profile data
          const token = jwt.sign(
            { _id, authProvider, email, handle, displayName, picture },
            JWT_SECRET
          );
          done(null, token);
        } catch (err) {
          done(err);
        }
      })
    )
  );
};
