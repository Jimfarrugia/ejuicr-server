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
        callbackURL: `${process.env.SERVER_URL}/auth/twitter/callback`,
        userProfileURL:
          "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      },
      asyncHandler(async (accessToken, accessTokenSecret, profile, done) => {
        try {
          // Load the node-fetch module dynamically using import()
          const fetch = await import("node-fetch");

          // Convert the user's profile image to a data URL
          // (otherwise firefox will prevent the remote image from loading if content blocking is enabled)
          const imageRemoteUrl = profile._json.profile_image_url_https.replace(
            "_normal",
            "_200x200"
          );
          const imageResponse = await fetch.default(imageRemoteUrl);
          const imageArrayBuffer = await imageResponse.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);
          const imageDataUrl = `data:${imageResponse.headers.get(
            "content-type"
          )};base64,${imageBuffer.toString("base64")}`;

          // Look for the user in the database using their Twitter ID and email address (match either)
          const twitterEmail = profile.emails[0].value;
          let user = await User.findOne({
            $or: [{ twitterId: profile.id }, { email: twitterEmail }],
          });

          if (!user) {
            // If the user doesn't exist, create a new user document with their Twitter profile information
            user = new User({
              authProvider: "twitter",
              email: twitterEmail,
              twitterId: profile.id,
              twitterDisplayName: profile.displayName,
              twitterHandle: profile.username,
              twitterPicture: imageDataUrl,
            });
            await user.save();
          } else {
            // If the user already exists, update their user document with their latest Twitter profile information
            user.authProvider = "twitter";
            user.twitterId = profile.id;
            user.twitterDisplayName = profile.displayName;
            user.twitterHandle = profile.username;
            user.twitterPicture = imageDataUrl;
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
