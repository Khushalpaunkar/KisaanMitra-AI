const express = require("express");
const router = express.Router();

const {
  showSchemespage,
  showAllSchemesPage,
  showSchemeDetails,
} = require("../controllers/schemesController");

router.get("/", showSchemespage);
router.get("/allschemes", showAllSchemesPage);
router.get("/:slug", showSchemeDetails);

module.exports = router;