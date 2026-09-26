const express = require("express");

const router = express.Router();

const {
  showFinderPage,
  findSchemes,
} = require("../controllers/schemesController");

// ==========================================
// FIND MY SCHEMES PAGE
// GET /findschemes
// ==========================================
router.get("/", showFinderPage);

// ==========================================
// ANALYZE FARMER PROFILE
// POST /findschemes/analyze
// ==========================================
router.post("/analyze", findSchemes);

module.exports = router;