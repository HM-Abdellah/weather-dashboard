# Weather Dashboard

A modern, feature-rich weather dashboard that fetches real-time data from a free public weather API with no authentication required.

## Features

### Current Weather
- 🌡️ **Real-time Temperature** - Accurate current conditions with feels-like temperature
- 🎨 **Weather Icons** - Visual representation of current weather conditions
- 💧 **Detailed Metrics**
  - Humidity percentage
  - Wind speed (with km/h or mph conversion)
  - Atmospheric pressure
  - UV index
  - Visibility distance
- 🌅 **Sunrise & Sunset** - Precise times for your location

### Forecasting
- 📈 **24-Hour Hourly Forecast** - Hour-by-hour breakdown with temperature and precipitation probability
- 📅 **7-Day Daily Forecast** - Extended forecast with highs, lows, and precipitation data
- 🎯 **Accurate Predictions** - Based on WMO weather codes

### Location Features
- 🔍 **City Search** - Search any city worldwide with autocomplete suggestions
- 📍 **Geolocation** - Automatically detect your location using device GPS
- ⭐ **Favorite Locations** - Save multiple locations for quick access
- 🌍 **Global Coverage** - Works for any location on Earth

### User Preferences
- 🌡️ **Temperature Units** - Toggle between Celsius and Fahrenheit
- 💾 **Local Storage** - Preferences and favorites saved automatically
- 🔄 **Auto Refresh** - Updates every 30 minutes automatically
- 🔃 **Manual Refresh** - Click to instantly update weather data

### User Experience
- 🎨 **Beautiful Design** - Modern gradient UI with smooth animations
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Loading** - Optimized API calls and rendering
- 🔔 **Toast Notifications** - Feedback for all user actions
- 🌐 **No Authentication** - Completely free, no API keys required

## Installation & Usage

### Quick Start

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/HM-Abdellah/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Open in your browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Start exploring weather!**

### How to Use

#### Getting Started
1. The app automatically detects your location on first load
2. Or click the 📍 button to use your device's GPS
3. Or search for any city using the search bar

#### Searching Cities
1. Type a city name in the search box
2. Select from autocomplete suggestions
3. Or click "Search" to find the city

#### Managing Favorites
1. When viewing a location's weather, click "Add to Favorites"
2. Click any favorite to quickly switch to that location
3. Remove favorites by clicking the X button

#### Temperature Units
- Click the °C/°F button in the header to toggle units
- Your preference is automatically saved

#### Refreshing Data
- Click the 🔄 button to manually refresh weather data
- Data automatically updates every 30 minutes

## Technical Details

### API Services Used

**Open-Meteo** (https://open-meteo.com/)
- Free weather forecasts
- No API key required
- Excellent accuracy and reliability
- Covers the entire world

**Open-Meteo Geocoding** (https://geocoding-api.open-meteo.com/)
- City name to coordinates conversion
- Autocomplete suggestions
- Reverse geocoding support

**IP-API** (https://ip-api.com/)
- Initial geolocation based on IP address
- Fallback when GPS is unavailable

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No dependencies, pure ES6+
- **Fetch API** - Modern HTTP requests
- **localStorage** - Local data persistence

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Structure
```
weather-dashboard/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling
├── app.js          # WeatherDashboard class
└── README.md       # Documentation
```

## Features Breakdown

### Weather Codes
The app uses WMO (World Meteorological Organization) weather interpretation codes for accurate descriptions:
- Clear sky, Partly cloudy, Overcast
- Drizzle (light, moderate, dense)
- Rain (slight, moderate, heavy)
- Snow (slight, moderate, heavy)
- Thunderstorms (with or without hail)
- Foggy conditions

### Distance Units
- **Metric**: kilometers, meters
- **Imperial**: miles (with mph for wind)

### Precipitation Data
- Probability percentages (0-100%)
- Actual precipitation amounts
- Hourly and daily breakdowns

## Performance

- **Lightweight** - Minimal CSS and JS
- **Fast API Calls** - Efficient request handling
- **Optimized Rendering** - Smooth animations
- **Responsive Design** - Works on all device sizes
- **No Dependencies** - Pure vanilla JavaScript

## Privacy & Data

- **Local Processing** - All calculations done locally
- **No Tracking** - No analytics or user tracking
- **No Accounts** - No login required
- **Secure** - Uses HTTPS for all API calls
- **Your Control** - Data stored locally in your browser

## Future Enhancements

Potential features for future versions:
- Air quality index (AQI)
- Pollen count warnings
- UV exposure warnings
- Severe weather alerts
- Historical weather data
- Weather comparisons
- Custom themes (dark mode)
- Map view with weather overlay
- Push notifications
- Offline support (PWA)

## Troubleshooting

### Weather not loading?
- Check your internet connection
- Verify browser console for errors (F12)
- Try refreshing the page
- Use a different city/location

### Geolocation not working?
- Check browser geolocation permissions
- Use the search function instead
- IP-based geolocation will be used as fallback

### Favorites not saving?
- Ensure localStorage is enabled
- Check browser privacy settings
- Try incognito mode to test

### Temperature conversion incorrect?
- Clear localStorage and reload
- Check that unit toggle was successful
- Verify browser supports localStorage

## API Rate Limits

- **Open-Meteo**: Unlimited free requests
- **Open-Meteo Geocoding**: Unlimited free requests
- **IP-API**: 45 requests/minute free tier

## Credits

**Weather Data**: [Open-Meteo](https://open-meteo.com/)
**Geolocation**: [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/)
**IP Geolocation**: [IP-API](https://ip-api.com/)

## License

This project is open source and available under the MIT License.

## Author

Created by **HM-Abdellah**

## Support

If you encounter issues or have suggestions:
1. Check the README for solutions
2. Open an issue on GitHub
3. Fork and submit a pull request

---

**Stay informed about the weather! ☀️🌧️⛈️**
