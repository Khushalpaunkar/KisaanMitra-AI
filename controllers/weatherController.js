const showWeatherPage = (req, res) => {
    res.render("weather/index");
};


const searchWeather = (req, res) => {

    const { city } = req.body;

    console.log("User searched city:", city);

    res.render("weather/index", {
        city: city
    });
};


const getWeatherByLocation = async (req, res) => {
    try {

        const { latitude, longitude } = req.body;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

        const response = await fetch(url);

        // JSON फक्त ONE TIME read करायचा
        const data = await response.json();

        console.log("Weather API Status:", response.status);
        console.log("Weather API Response:", data);

        if (!response.ok) {
            throw new Error(data.reason || "Weather API request failed");
        }

        // Frontend ला data पाठवणे
        res.json({
            success: true,
            weather: data
        });

    } catch (error) {

        console.error("Weather Location Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { showWeatherPage ,searchWeather, getWeatherByLocation};

