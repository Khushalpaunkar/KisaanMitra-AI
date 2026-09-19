const express = require("express");

const router = express.Router();

const {
    showCropIntelligencePage,
    analyzeCrop
} = require("../controllers/cropController");


// Crop Intelligence Page
router.get("/", showCropIntelligencePage);


// AI Crop Recommendation
router.post("/analyze", analyzeCrop);


module.exports = router;