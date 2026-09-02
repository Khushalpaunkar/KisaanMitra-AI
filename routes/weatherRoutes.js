const express = require("express");
const router = express.Router();

router.get("/" , (req , res) => {
  res.render("weather/index");
});


module.exports = router ;