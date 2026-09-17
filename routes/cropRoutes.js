const express = require('express');
const router = express.Router();

const { showCropIntelligencePage } = require('../controllers/cropController');

router.get("/" , showCropIntelligencePage);

module.exports = router ;