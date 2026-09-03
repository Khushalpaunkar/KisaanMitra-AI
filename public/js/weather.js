

// ================= ELEMENTS =================

const locationButton = document.getElementById("get-location");
const searchForm = document.querySelector(".weather-search");


// ================= WEATHER INFO =================

function getWeatherInfo(code) {

    if (code === 0) {
        return {
            icon: "☀️",
            text: "स्वच्छ आकाश"
        };
    }

    if (code >= 1 && code <= 3) {
        return {
            icon: "🌤️",
            text: "ढगाळ हवामान"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            icon: "🌧️",
            text: "पाऊस"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            icon: "❄️",
            text: "हिमवृष्टी"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            icon: "🌧️",
            text: "पावसाच्या सरी"
        };
    }

    if (code >= 95) {
        return {
            icon: "⛈️",
            text: "वादळी हवामान"
        };
    }

    return {
        icon: "🌤️",
        text: "हवामान माहिती उपलब्ध"
    };
}


// ======================================================
// UPDATE COMPLETE WEATHER UI
// ======================================================

function updateWeatherUI(weather) {

    console.log("Updating Weather UI:", weather);


    // ==================================================
    // CURRENT WEATHER
    // ==================================================

    const current = weather.current;


    // Weather condition

    const currentWeatherInfo =
        getWeatherInfo(current.weather_code);


    document.querySelector(".weather-icon").textContent =
        currentWeatherInfo.icon;


    document.getElementById("weather-condition").textContent =
        currentWeatherInfo.text;


    // Temperature

    document.getElementById("temperature").textContent =
        Math.round(current.temperature_2m);


    // Feels like

    document.getElementById("feels-like").textContent =
        Math.round(current.apparent_temperature) + "°C";


    // Humidity

    document.getElementById("humidity").textContent =
        current.relative_humidity_2m + "%";


    // Wind

    document.getElementById("wind-speed").textContent =
        current.wind_speed_10m + " km/h";


    // ==================================================
    // TODAY MAX & MIN
    // ==================================================

    document.getElementById("max-temp").textContent =
        Math.round(weather.daily.temperature_2m_max[0]) + "°C";


    document.getElementById("min-temp").textContent =
        Math.round(weather.daily.temperature_2m_min[0]) + "°C";


    // ==================================================
    // TODAY RAIN PROBABILITY
    // ==================================================

    document.getElementById("rain-probability").textContent =
        weather.daily.precipitation_probability_max[0] + "%";


    // ==================================================
    // 7 DAY FORECAST
    // ==================================================

    updateForecast(weather);


    console.log("Weather UI Updated Successfully");
}


// ======================================================
// 7 DAY FORECAST
// ======================================================

function updateForecast(weather) {

    const forecastCards =
        document.querySelectorAll(".forecast-card");


    const dates =
        weather.daily.time;


    const maxTemps =
        weather.daily.temperature_2m_max;


    const rainProbabilities =
        weather.daily.precipitation_probability_max;


    const weatherCodes =
        weather.daily.weather_code;


    // Marathi day names

    const dayNames = [
        "रविवार",
        "सोमवार",
        "मंगळवार",
        "बुधवार",
        "गुरुवार",
        "शुक्रवार",
        "शनिवार"
    ];


    forecastCards.forEach((card, index) => {

        // Safety check

        if (!dates[index]) {
            return;
        }


        // ==================================================
        // DATE
        // ==================================================

        const date =
            new Date(dates[index] + "T00:00:00");


        // ==================================================
        // DAY NAME
        // ==================================================

        let dayName;


        if (index === 0) {

            dayName = "आज";

        }
        else if (index === 1) {

            dayName = "उद्या";

        }
        else {

            dayName =
                dayNames[date.getDay()];

        }


        // ==================================================
        // WEATHER CODE
        // ==================================================

        const code =
            weatherCodes[index];


        const weatherInfo =
            getWeatherInfo(code);


        // ==================================================
        // UPDATE CARD
        // ==================================================

        card.querySelector(".forecast-day").textContent =
            dayName;


        card.querySelector(".forecast-icon").textContent =
            weatherInfo.icon;


        card.querySelector(".forecast-temp").textContent =
            Math.round(maxTemps[index]) + "°";


        card.querySelector(".forecast-rain").textContent =
            rainProbabilities[index] + "% पाऊस";

    });


    console.log("7 Day Forecast Updated");
}


// ======================================================
// CITY SEARCH
// ======================================================

searchForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Input

    const cityInput =
        searchForm.querySelector("input[name='city']");


    const city =
        cityInput.value.trim();


    if (!city) {
        return;
    }


    // Search button

    const searchButton =
        searchForm.querySelector("button");


    // Loading

    searchButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        शोधत आहे...
    `;


    try {

        // ==================================================
        // SEND CITY TO BACKEND
        // ==================================================

        const response =
            await fetch("/weather/search", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    city: city
                })

            });


        // Convert response to JSON

        const data =
            await response.json();


        console.log(
            "City Weather Response:",
            data
        );


        // ==================================================
        // ERROR CHECK
        // ==================================================

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "City सापडले नाही."
            );

        }


        // ==================================================
        // UPDATE LOCATION NAME
        // ==================================================

        const locationName =
            data.location.name;


        const state =
            data.location.state;


        const locationText =
            state
                ? `${locationName}, ${state}`
                : locationName;


        document.getElementById(
            "current-location"
        ).textContent =
            locationText;


        // ==================================================
        // UPDATE WEATHER
        // ==================================================

        const weather =
            data.weather;


        updateWeatherUI(weather);


        // ==================================================
        // RESET SEARCH BUTTON
        // ==================================================

        searchButton.innerHTML = `
            <i class="fa-solid fa-location-crosshairs"></i>
            ठिकाण बदला
        `;


        cityInput.value = "";


        console.log(
            "City Weather UI Updated Successfully"
        );


    }
    catch (error) {

        console.error(
            "City Search Error:",
            error
        );


        alert(error.message);


        searchButton.innerHTML = `
            <i class="fa-solid fa-location-crosshairs"></i>
            ठिकाण बदला
        `;

    }

});


// ======================================================
// CURRENT LOCATION
// ======================================================

locationButton.addEventListener("click", () => {


    // ==================================================
    // CHECK GEOLOCATION SUPPORT
    // ==================================================

    if (!navigator.geolocation) {

        alert(
            "तुमच्या browser मध्ये location support नाही."
        );

        return;
    }


    // ==================================================
    // LOADING BUTTON
    // ==================================================

    locationButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Location शोधत आहे...
    `;


    // ==================================================
    // GET CURRENT LOCATION
    // ==================================================

    navigator.geolocation.getCurrentPosition(

        // ==================================================
        // SUCCESS
        // ==================================================

        async (position) => {

            try {

                const latitude =
                    position.coords.latitude;


                const longitude =
                    position.coords.longitude;


                console.log(
                    "Latitude:",
                    latitude
                );


                console.log(
                    "Longitude:",
                    longitude
                );


                // ==================================================
                // SEND LOCATION TO BACKEND
                // ==================================================

                const response =
                    await fetch(
                        "/weather/location",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                latitude: latitude,
                                longitude: longitude
                            })

                        }
                    );


                // ==================================================
                // READ JSON ONLY ONCE
                // ==================================================

                const data =
                    await response.json();


                console.log(
                    "Backend response:",
                    data
                );


                // ==================================================
                // ERROR CHECK
                // ==================================================

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Weather data मिळू शकला नाही."
                    );

                }


                // ==================================================
                // WEATHER DATA
                // ==================================================

                const weather =
                    data.weather;


                // ==================================================
                // UPDATE WEATHER UI
                // ==================================================

                updateWeatherUI(weather);


                // ==================================================
                // LOCATION BUTTON SUCCESS
                // ==================================================

                locationButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Location मिळाले
                `;


                console.log(
                    "Current Location Weather Updated Successfully"
                );

            }
            catch (error) {

                console.error(
                    "Location Weather Error:",
                    error
                );


                alert(error.message);


                locationButton.innerHTML = `
                    <i class="fa-solid fa-location-crosshairs"></i>
                    माझे सध्याचे ठिकाण
                `;

            }

        },


        // ==================================================
        // GEOLOCATION ERROR
        // ==================================================

        (error) => {

            console.error(
                "Geolocation Error:",
                error
            );


            alert(
                "Location मिळू शकले नाही. कृपया location permission द्या."
            );


            locationButton.innerHTML = `
                <i class="fa-solid fa-location-crosshairs"></i>
                माझे सध्याचे ठिकाण
            `;

        }

    );

});