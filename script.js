// script.js

// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search functionality
async function handleSearch() {
    const city = cityInput.value.trim();
    
    // Validate input
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
    } catch (err) {
        showError(err.message);
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your configuration.');
        } else {
            throw new Error('Failed to fetch weather data. Please try again.');
        }
    }
    
    return await response.json();
}

// Display weather data in UI
function displayWeatherData(data) {
    // Hide loading and error states
    hideAll();
    
    // Update weather information
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Show weather display
    weatherDisplay.classList.remove('hidden');
}

// Show loading state
function showLoading() {
    hideAll();
    loading.classList.remove('hidden');
}

// Show error message
function showError(message) {
    hideAll();
    error.textContent = message;
    error.classList.remove('hidden');
}

// Hide all display elements
function hideAll() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}
