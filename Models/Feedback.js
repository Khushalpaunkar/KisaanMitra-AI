const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    userType: {
      type: String,
      required: true
    },

    location: {
      type: String,
      trim: true
    },

    feature: {
      type: String
    },

    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);