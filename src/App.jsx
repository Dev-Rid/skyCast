import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import weatherService from './services/weatherService';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    // Get user's location on app load
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
          } catch (err) {
            setError('Unable to fetch weather data for your location');
            setLoading(false);
          }
        },
        () => {
          // Fallback to default city if geolocation fails
          handleSearch('New York');
        }
      );
    } else {
      handleSearch('New York');
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError('');
      
      const [weather, forecast] = await Promise.all([
        weatherService.getWeatherByCoords(lat, lon, unit),
        weatherService.getForecastByCoords(lat, lon, unit)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    try {
      setLoading(true);
      setError('');
      
      const [weather, forecast] = await Promise.all([
        weatherService.getWeatherByCity(city, unit),
        weatherService.getForecastByCity(city, unit)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    
    if (weatherData) {
      if (weatherData.coord) {
        fetchWeatherByCoords(weatherData.coord.lat, weatherData.coord.lon);
      }
    }
  };

  const getBackgroundClass = () => {
    if (!weatherData) return 'default';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const isDay = weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset;
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'rainy';
    } else if (condition.includes('cloud')) {
      return 'cloudy';
    } else if (condition.includes('clear')) {
      return isDay ? 'sunny' : 'clear-night';
    } else if (condition.includes('snow')) {
      return 'snowy';
    }
    
    return 'default';
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Weather App</h1>
          <div className="header-controls">
            <button 
              className="unit-toggle"
              onClick={handleUnitToggle}
              disabled={loading}
            >
              {unit === 'metric' ? '°F' : '°C'}
            </button>
          </div>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {weatherData && !loading && (
          <div className="weather-content">
            <WeatherCard weather={weatherData} unit={unit} />
            {forecastData && <Forecast forecast={forecastData} unit={unit} />}
          </div>
        )}

        {!weatherData && !loading && !error && (
          <div className="welcome-message">
            <h2>Welcome to Weather App</h2>
            <p>Search for a city to get started, or allow location access for local weather</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;