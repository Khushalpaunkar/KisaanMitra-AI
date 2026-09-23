const express = require("express");
const router = express.Router();

const {showSchemespage} = require("../controllers/schemesController");

router.get("/" , showSchemespage);

module.exports = router;