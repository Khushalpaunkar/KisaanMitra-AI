const express = require("express");
const router = express.Router();

const marketController = require("../controllers/marketController");

router.get("/market", marketController.renderMarketDashboard);
router.get("/market-analysis", marketController.renderMarketAnalysis);
router.get("/market/districts", marketController.getDistricts);
router.get("/market/markets", marketController.getMarkets);
router.post("/market/analyze", marketController.analyzeMarket);
router.post("/market/ai-insight", marketController.getAIInsight);

module.exports = router;