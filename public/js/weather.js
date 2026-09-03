const locationButton = document.getElementById("get-location");

locationButton.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("तुमच्या browser मध्ये location support नाही.");
        return;
    }

    locationButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Location शोधत आहे...
    `;

    navigator.geolocation.getCurrentPosition(

        // SUCCESS
        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            fetch("/weather/location", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude
                })
            })
             
            .then(response => {

    console.log("Response received:", response);

    return response.json();

})

.then(data => {

    console.log("Backend response:", data);

    const weather = data.weather;

    console.log(
        "Current Temperature:",
        weather.current.temperature_2m
    );

    console.log(
        "Humidity:",
        weather.current.relative_humidity_2m
    );

    console.log(
        "Wind Speed:",
        weather.current.wind_speed_10m
    );

    locationButton.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Location मिळाले
    `;

})

            .catch(error => {

                console.error("Fetch error:", error);

                locationButton.innerHTML = `
                    <i class="fa-solid fa-location-crosshairs"></i>
                    माझे सध्याचे ठिकाण
                `;

            });

        },

        // ERROR
        (error) => {

            console.log(error);

            alert("Location मिळू शकले नाही. कृपया location permission द्या.");

            locationButton.innerHTML = `
                <i class="fa-solid fa-location-crosshairs"></i>
                माझे सध्याचे ठिकाण
            `;

        }

    );

});