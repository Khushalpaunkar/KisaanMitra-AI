const showWeatherPage = (req, res) => {
    res.render("weather/index");
};


const searchWeather = async (req, res) => {
    try {

        const { city } = req.body;

        console.log("User searched city:", city);

        // City → Latitude & Longitude
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok || !geoData.results || geoData.results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "City सापडले नाही."
            });
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        console.log("City:", location.name);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        // Weather API
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error("Weather API request failed");
        }

        console.log("Weather API Status:", weatherResponse.status);

        res.json({
            success: true,
            location: {
                name: location.name,
                state: location.admin1 || "",
                country: location.country || ""
            },
            weather: weatherData
        });

    } catch (error) {

        console.error("City Weather Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getWeatherByLocation = async (req, res) => {
    try {

        const { latitude, longitude } = req.body;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`;
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

