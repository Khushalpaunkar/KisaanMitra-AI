const express = require("express");
const router = express.Router();

const {showWeatherPage, searchWeather, getWeatherByLocation} = require("../controllers/weatherController");

router.get("/" , showWeatherPage);
router.post("/search" , searchWeather);
router.post("/location", getWeatherByLocation);

module.exports = router;