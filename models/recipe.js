const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // author: {
    //   type: Ref to user
    // }
    strength: {
      type: Number,
      default: 0,
      min: 0,
    },
    base: {
      pg: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      vg: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    ingredients: {
      nicotine: {
        strength: {
          type: Number,
          min: 0,
          max: 1000,
          required: true,
        },
        base: {
          pg: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
          vg: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
        },
      },
      flavors: [
        {
          name: {
            type: String,
            trim: true,
            required: true,
          },
          percentage: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
          base: {
            pg: {
              type: Number,
              min: 0,
              max: 100,
              required: true,
            },
            vg: {
              type: Number,
              min: 0,
              max: 100,
              required: true,
            },
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("recipe", recipeSchema);
