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
      unique: true,
    },
    twitterId: {
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
    },
    handle: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
