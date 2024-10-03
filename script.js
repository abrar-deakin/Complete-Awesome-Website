document.addEventListener('DOMContentLoaded', () => {
    const cityId = 'Sydney'; // Hardcode city ID or name
    const apiKey = 'b16ff16c254c613e3e4c9eeaee97d97c'; // Your actual API key
    const lat = -33.867; // Latitude for Sydney
    const lon = 151.207; // Longitude for Sydney
    let forecastData = []; // To store the forecast data

    // Fetch current weather
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityId}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                // Update current weather section
                document.getElementById('currentTemp').innerText = `${data.main.temp}°C`;
                document.getElementById('currentFeels').innerText = `Feels like ${data.main.feels_like}°C`;
                document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;

                // Additional weather details
                const weatherDetails = `
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind: ${data.wind.speed} km/h</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon" style="width: 100px; height: auto;">
                `;
                document.getElementById('weatherDetails').innerHTML = weatherDetails;

                // Fetch and display 5-day/3-hour forecast
                fetchFiveDayForecast(lat, lon, apiKey);
            } else {
                document.getElementById('weatherDetails').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherDetails').innerHTML = '<p>Failed to fetch weather data.</p>';
        });
});

// Function to fetch 5-day/3-hour forecast
function fetchFiveDayForecast(lat, lon, apiKey) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                forecastData = data.list; // Store the forecast data globally
                displayForecast(forecastData); // Display initial forecast
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast data:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Failed to fetch forecast data.</p>';
        });
}

// Function to display the forecast data based on the selected date
function displayForecast(forecastList) {
    let weatherForecast = '';
    const selectedDate = new Date(document.getElementById('currentDate').innerText);
    
    forecastList.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        // Check if the forecast entry matches the selected date
        if (forecastDate.toDateString() === selectedDate.toDateString()) {
            const date = forecastDate.toLocaleString(); // Convert UNIX timestamp to readable format
            const temperature = forecast.main.temp;
            const weatherDescription = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon; // Get the icon code
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the icon URL

            // Add the forecast details to the result string
            weatherForecast += `
                <div class="forecast">
                    <p>Date: ${date}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weatherDescription}</p>
                    <img src="${iconUrl}" alt="Weather Icon" style="width: 100px; height: auto;">
                </div>
            `;
        }
    });

    // Display the weather forecast
    document.getElementById('weatherResult').innerHTML = weatherForecast || '<p>No forecast available for the selected date.</p>';
}

// Update the forecast based on the selected date
function updateForecast() {
    displayForecast(forecastData); // Call the display function with the stored forecast data
}
