const express = require("express");
const router = express.Router();

const Feedback = require("../Models/Feedback");

router.post("/submit", async (req, res) => {
  try {
    const {
      name,
      email,
      userType,
      location,
      feature,
      rating,
      message
    } = req.body;

    const feedback = new Feedback({
      name,
      email,
      userType,
      location,
      feature,
      rating: rating ? Number(rating) : undefined,
      message
    });

    await feedback.save();

    res.redirect("/support?feedback=success");

  } catch (error) {
    console.error("Feedback Error:", error);

    res.redirect("/support?feedback=error");
  }
});

module.exports = router;