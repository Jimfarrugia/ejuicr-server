const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
    units: {
      type: String,
      enum: ["weight", "volume", "both"],
      default: "both",
      required: true,
    },
    base: {
      pg: {
        type: Number,
        min: 0,
        max: 100,
        default: 30,
        required: true,
      },
      vg: {
        type: Number,
        min: 0,
        max: 100,
        default: 70,
        required: true,
      },
    },
    strength: {
      type: Number,
      min: 0,
      default: 6,
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      default: 30,
      required: true,
    },
    zeroNicotineMode: {
      type: Boolean,
      default: false,
      required: true,
    },
    nicotine: {
      strength: {
        type: Number,
        min: 0,
        max: 1000,
        default: 100,
        required: true,
      },
      base: {
        pg: {
          type: Number,
          min: 0,
          max: 100,
          default: 100,
          required: true,
        },
        vg: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
          required: true,
        },
      },
    },
    flavor: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 5,
        required: true,
      },
      base: {
        pg: {
          type: Number,
          min: 0,
          max: 100,
          default: 100,
          required: true,
        },
        vg: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("settings", settingsSchema);
