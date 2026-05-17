// Weather Dashboard - Main Application

class WeatherDashboard {
    constructor() {
        this.currentUnit = 'celsius';
        this.currentLocation = null;
        this.favorites = [];
        this.weatherData = null;
        this.autoRefreshInterval = null;

        this.initElements();
        this.loadPreferences();
        this.initEventListeners();
        this.initializeApp();
    }

    initElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.geoBtn = document.getElementById('geoBtn');
        this.suggestions = document.getElementById('suggestions');

        // Header controls
        this.unitToggle = document.getElementById('unitToggle');
        this.refreshBtn = document.getElementById('refreshBtn');

        // Display elements
        this.locationName = document.getElementById('locationName');
        this.lastUpdate = document.getElementById('lastUpdate');
        this.temperature = document.getElementById('temperature');
        this.tempUnit = document.getElementById('tempUnit');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.uvIndex = document.getElementById('uvIndex');
        this.visibility = document.getElementById('visibility');
        this.sunrise = document.getElementById('sunrise');
        this.sunset = document.getElementById('sunset');

        // Forecast elements
        this.hourlyForecast = document.getElementById('hourlyForecast');
        this.dailyForecast = document.getElementById('dailyForecast');

        // Alerts
        this.alertsSection = document.getElementById('alertsSection');
        this.alertsList = document.getElementById('alertsList');

        // Favorites
        this.favoritesList = document.getElementById('favoritesList');

        // Footer
        this.footerTime = document.getElementById('footerTime');

        // Toast
        this.toast = document.getElementById('toast');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    initEventListeners() {
        // Search
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        this.searchInput.addEventListener('input', () => this.showSuggestions());

        // Geolocation
        this.geoBtn.addEventListener('click', () => this.useGeolocation());

        // Unit toggle
        this.unitToggle.addEventListener('click', () => this.toggleUnit());

        // Refresh
        this.refreshBtn.addEventListener('click', () => this.refreshWeather());

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== this.searchInput) {
                this.suggestions.classList.add('hidden');
            }
        });
    }

    initializeApp() {
        this.showLoading(true);
        // Try to get user's location or use default
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.getWeatherByCoords(position.coords.latitude, position.coords.longitude),
                () => this.getWeatherByIP()
            );
        } else {
            this.getWeatherByIP();
        }
    }

    async getWeatherByIP() {
        try {
            const response = await fetch('https://ip-api.com/json/');
            const data = await response.json();
            if (data.status === 'success') {
                this.getWeatherByCoords(data.lat, data.lon, `${data.city}, ${data.country}`);
            }
        } catch (error) {
            console.error('IP geolocation error:', error);
            this.getWeatherByCoords(48.8566, 2.3522); // Paris fallback
        }
    }

    async getWeatherByCoords(lat, lon, name = null) {
        try {
            // Get geocoding info if name not provided
            let location = name;
            if (!location) {
                try {
                    const geoResponse = await fetch(
                        `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
                    );
                    const geoData = await geoResponse.json();
                    if (geoData.results && geoData.results.length > 0) {
                        const result = geoData.results[0];
                        location = `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}`;
                    }
                } catch (e) {
                    location = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
                }
            }

            this.currentLocation = { name: location, lat, lon };

            // Fetch weather data
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,uv_index',
                hourly: 'temperature_2m,weather_code,precipitation_probability',
                daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max',
                timezone: 'auto'
            });

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
            const data = await response.json();

            this.weatherData = data;
            this.renderWeather();
            this.showLoading(false);
            this.showToast(`Weather loaded for ${location}`, 'success');
            this.startAutoRefresh();
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showToast('Failed to fetch weather data', 'error');
            this.showLoading(false);
        }
    }

    async searchCity() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        try {
            this.showLoading(true);
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const location = `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}`;
                await this.getWeatherByCoords(result.latitude, result.longitude, location);
                this.searchInput.value = '';
                this.suggestions.classList.add('hidden');
            } else {
                this.showToast('City not found', 'error');
                this.showLoading(false);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Search failed', 'error');
            this.showLoading(false);
        }
    }

    async showSuggestions() {
        const query = this.searchInput.value.trim();
        if (!query || query.length < 2) {
            this.suggestions.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                this.suggestions.innerHTML = data.results.map(result => `
                    <div class="suggestion-item" data-lat="${result.latitude}" data-lon="${result.longitude}">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country}</span>
                    </div>
                `).join('');

                this.suggestions.classList.remove('hidden');

                // Add click handlers
                document.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const lat = parseFloat(item.dataset.lat);
                        const lon = parseFloat(item.dataset.lon);
                        const location = item.querySelector('span').textContent;
                        this.getWeatherByCoords(lat, lon, location);
                        this.searchInput.value = '';
                        this.suggestions.classList.add('hidden');
                    });
                });
            } else {
                this.suggestions.classList.add('hidden');
            }
        } catch (error) {
            console.error('Suggestions error:', error);
        }
    }

    useGeolocation() {
        if (!navigator.geolocation) {
            this.showToast('Geolocation not supported', 'error');
            return;
        }

        this.geoBtn.classList.add('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.geoBtn.classList.remove('loading');
                this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                this.geoBtn.classList.remove('loading');
                this.showToast('Could not get your location', 'error');
            }
        );
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        this.unitToggle.textContent = this.currentUnit === 'celsius' ? '\u00b0C' : '\u00b0F';
        this.tempUnit.textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
        this.savePreferences();
        this.renderWeather();
    }

    convertTemp(celsius) {
        if (this.currentUnit === 'fahrenheit') {
            return Math.round((celsius * 9/5) + 32);
        }
        return Math.round(celsius);
    }

    convertSpeed(kmh) {
        if (this.currentUnit === 'fahrenheit') {
            return Math.round(kmh * 0.621371); // to mph
        }
        return Math.round(kmh);
    }

    getWindUnit() {
        return this.currentUnit === 'celsius' ? 'km/h' : 'mph';
    }

    getWeatherIcon(weatherCode, isDay = true) {
        // WMO Weather interpretation codes
        const iconMap = {
            0: 'fa-sun', // Clear sky
            1: 'fa-cloud-sun', // Mainly clear
            2: 'fa-cloud', // Partly cloudy
            3: 'fa-cloud', // Overcast
            45: 'fa-cloud', // Foggy
            48: 'fa-cloud', // Foggy
            51: 'fa-cloud-rain', // Light drizzle
            53: 'fa-cloud-rain', // Moderate drizzle
            55: 'fa-cloud-rain', // Dense drizzle
            61: 'fa-cloud-rain', // Slight rain
            63: 'fa-cloud-rain', // Moderate rain
            65: 'fa-cloud-rain', // Heavy rain
            71: 'fa-snowflake', // Slight snow
            73: 'fa-snowflake', // Moderate snow
            75: 'fa-snowflake', // Heavy snow
            77: 'fa-snowflake', // Snow grains
            80: 'fa-cloud-rain', // Slight rain showers
            81: 'fa-cloud-rain', // Moderate rain showers
            82: 'fa-cloud-rain', // Violent rain showers
            85: 'fa-snowflake', // Slight snow showers
            86: 'fa-snowflake', // Heavy snow showers
            95: 'fa-bolt', // Thunderstorm
            96: 'fa-bolt', // Thunderstorm with slight hail
            99: 'fa-bolt' // Thunderstorm with heavy hail
        };

        return 'fas ' + (iconMap[weatherCode] || 'fa-cloud');
    }

    getWeatherDescription(weatherCode) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light drizzle',
            53: 'Drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with heavy hail'
        };

        return descriptions[weatherCode] || 'Unknown';
    }

    renderWeather() {
        if (!this.weatherData) return;

        const current = this.weatherData.current;
        const hourly = this.weatherData.hourly;
        const daily = this.weatherData.daily;

        // Update location and time
        this.locationName.textContent = this.currentLocation.name;
        this.lastUpdate.textContent = `Updated: ${new Date(current.time).toLocaleTimeString()}`;

        // Update current weather
        const temp = this.convertTemp(current.temperature_2m);
        this.temperature.textContent = temp;
        this.weatherIcon.className = this.getWeatherIcon(current.weather_code);
        this.weatherDescription.textContent = this.getWeatherDescription(current.weather_code);

        // Update details
        this.feelsLike.textContent = this.convertTemp(current.apparent_temperature) + '°';
        this.humidity.textContent = current.relative_humidity_2m + '%';
        this.windSpeed.textContent = this.convertSpeed(current.wind_speed_10m) + ' ' + this.getWindUnit();
        this.pressure.textContent = current.pressure_msl + ' hPa';
        this.uvIndex.textContent = Math.round(current.uv_index);
        this.visibility.textContent = (current.visibility / 1000).toFixed(1) + ' km';

        // Update sunrise/sunset
        const sunriseTime = new Date(daily.sunrise[0]);
        const sunsetTime = new Date(daily.sunset[0]);
        this.sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        this.sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Update footer time
        this.footerTime.textContent = new Date().toLocaleTimeString();

        // Render hourly forecast (next 24 hours)
        this.renderHourlyForecast(hourly);

        // Render daily forecast (7 days)
        this.renderDailyForecast(daily);

        // Update favorites list
        this.renderFavorites();
    }

    renderHourlyForecast(hourly) {
        const now = new Date();
        const startIndex = Math.floor((now - new Date(hourly.time[0])) / (1000 * 60 * 60));

        let html = '';
        for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
            const time = new Date(hourly.time[i]);
            const temp = this.convertTemp(hourly.temperature_2m[i]);
            const code = hourly.weather_code[i];
            const rainProb = hourly.precipitation_probability[i];

            html += `
                <div class="hourly-item">
                    <div class="hourly-time">${time.getHours().toString().padStart(2, '0')}:00</div>
                    <div class="hourly-icon"><i class="${this.getWeatherIcon(code)}"></i></div>
                    <div class="hourly-temp">${temp}°</div>
                    ${rainProb > 0 ? `<div class="hourly-rain">💧 ${rainProb}%</div>` : ''}
                </div>
            `;
        }
        this.hourlyForecast.innerHTML = html;
    }

    renderDailyForecast(daily) {
        let html = '';
        for (let i = 0; i < Math.min(7, daily.time.length); i++) {
            const date = new Date(daily.time[i]);
            const high = this.convertTemp(daily.temperature_2m_max[i]);
            const low = this.convertTemp(daily.temperature_2m_min[i]);
            const code = daily.weather_code[i];
            const rainProb = daily.precipitation_probability_max[i];
            const rain = daily.precipitation_sum[i];

            const dateStr = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            html += `
                <div class="daily-item">
                    <div class="daily-date">${dateStr}</div>
                    <div class="daily-icon"><i class="${this.getWeatherIcon(code)}"></i></div>
                    <div class="daily-temps">
                        <span class="daily-high">${high}°</span>
                        <span class="daily-low">${low}°</span>
                    </div>
                    <div class="daily-desc">${this.getWeatherDescription(code)}</div>
                    ${rainProb > 0 ? `<div class="daily-rain"><i class="fas fa-droplet"></i> ${rainProb}% • ${rain.toFixed(1)}mm</div>` : ''}
                </div>
            `;
        }
        this.dailyForecast.innerHTML = html;
    }

    renderFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesList.innerHTML = '<div class="no-favorites">No favorite locations yet. Add one!</div>';
            return;
        }

        this.favoritesList.innerHTML = this.favorites.map((fav, index) => `
            <div class="favorite-item" data-index="${index}">
                <div class="favorite-name">${fav.name}</div>
                <div class="favorite-temp">${fav.temp}°</div>
                <div class="favorite-desc">${fav.desc}</div>
                <button class="favorite-remove" data-index="${index}" title="Remove from favorites">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-remove')) {
                    const fav = this.favorites[parseInt(item.dataset.index)];
                    this.getWeatherByCoords(fav.lat, fav.lon, fav.name);
                }
            });
        });

        document.querySelectorAll('.favorite-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(parseInt(btn.dataset.index));
            });
        });
    }

    addToFavorites() {
        if (!this.currentLocation || !this.weatherData) return;

        const alreadyFavorited = this.favorites.some(f => f.lat === this.currentLocation.lat && f.lon === this.currentLocation.lon);
        if (alreadyFavorited) {
            this.showToast('Already in favorites', 'info');
            return;
        }

        const current = this.weatherData.current;
        this.favorites.push({
            name: this.currentLocation.name,
            lat: this.currentLocation.lat,
            lon: this.currentLocation.lon,
            temp: this.convertTemp(current.temperature_2m),
            desc: this.getWeatherDescription(current.weather_code)
        });

        this.savePreferences();
        this.renderFavorites();
        this.showToast(`Added ${this.currentLocation.name} to favorites`, 'success');
    }

    removeFavorite(index) {
        const name = this.favorites[index].name;
        this.favorites.splice(index, 1);
        this.savePreferences();
        this.renderFavorites();
        this.showToast(`Removed ${name} from favorites`, 'success');
    }

    refreshWeather() {
        if (!this.currentLocation) return;
        this.refreshBtn.classList.add('loading');
        setTimeout(() => {
            this.getWeatherByCoords(this.currentLocation.lat, this.currentLocation.lon, this.currentLocation.name);
            this.refreshBtn.classList.remove('loading');
        }, 500);
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);
        // Auto refresh every 30 minutes
        this.autoRefreshInterval = setInterval(() => this.refreshWeather(), 30 * 60 * 1000);
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.remove('hidden');

        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }

    savePreferences() {
        localStorage.setItem('weatherPreferences', JSON.stringify({
            unit: this.currentUnit,
            favorites: this.favorites
        }));
    }

    loadPreferences() {
        const saved = localStorage.getItem('weatherPreferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.currentUnit = prefs.unit || 'celsius';
            this.favorites = prefs.favorites || [];
            this.unitToggle.textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
            this.tempUnit.textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});
