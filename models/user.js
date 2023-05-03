const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      min: 8,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      max: 255,
    },
    authProvider: {
      type: String,
    },
    googleId: {
      type: String,
    },
    googlePicture: {
      type: String,
    },
    googleDisplayName: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    twitterPicture: {
      type: String,
    },
    twitterDisplayName: {
      type: String,
    },
    twitterHandle: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
