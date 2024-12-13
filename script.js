const apiBaseUrl = "https://api.open-meteo.com/v1/forecast";
const latitude = 52.52; // Example: Berlin
const longitude = 13.41; // Example: Berlin
const hourlyParams = "temperature_2m,weathercode";

// DOM elements
const content = document.getElementById("content");
const tempPageButton = document.getElementById("temp-page");
const conditionsPageButton = document.getElementById("conditions-page");

// Fetch data from the API
async function fetchWeatherData() {
    try {
        const response = await fetch(
            `${apiBaseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=${hourlyParams}`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        return await response.json();
    } catch (error) {
        content.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Display temperature data
async function displayTemperature() {
    const data = await fetchWeatherData();
    if (!data) return;
    const temperatures = data.hourly.temperature_2m;

    content.innerHTML = `
        <h2>Hourly Temperatures</h2>
        <ul>
            ${temperatures
                .map((temp, index) => `<li>Hour ${index + 1}: ${temp}Â°C</li>`)
                .join("")}
        </ul>
    `;
}

// Display weather conditions
async function displayConditions() {
    const data = await fetchWeatherData();
    if (!data) return;
    const weatherCodes = data.hourly.weathercode;

    content.innerHTML = `
        <h2>Hourly Conditions</h2>
        <ul>
            ${weatherCodes
                .map(
                    (code, index) =>
                        `<li>Hour ${index + 1}: ${getWeatherDescription(
                            code
                        )}</li>`
                )
                .join("")}
        </ul>
    `;
}

// Translate weather code to description
function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light",
        53: "Drizzle: Moderate",
        55: "Drizzle: Dense",
        61: "Rain: Slight",
        63: "Rain: Moderate",
        65: "Rain: Heavy",
        71: "Snow: Slight",
        73: "Snow: Moderate",
        75: "Snow: Heavy",
        80: "Rain showers: Slight",
        81: "Rain showers: Moderate",
        82: "Rain showers: Violent",
    };
    return descriptions[code] || "Unknown condition";
}

// Event listeners for navigation
tempPageButton.addEventListener("click", displayTemperature);
conditionsPageButton.addEventListener("click", displayConditions);

// Default to displaying temperature
displayTemperature();