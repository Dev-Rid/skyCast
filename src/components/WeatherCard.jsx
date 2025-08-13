import React from 'react';

const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const windSpeed = unit === 'metric' ? `${weather.wind.speed} m/s` : `${weather.wind.speed} mph`;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-location">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p className="weather-date">{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        
        <div className="weather-temp">
          <span className="temp-value">{temperature}</span>
          <span className="temp-unit">{unitSymbol}</span>
        </div>
        
        <div className="weather-condition">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <p className="condition-text">{weather.weather[0].description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{feelsLike}{unitSymbol}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.main.humidity}%</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{windSpeed}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weather.main.pressure} hPa</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Sunrise</span>
          <span className="detail-value">{formatTime(weather.sys.sunrise)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Sunset</span>
          <span className="detail-value">{formatTime(weather.sys.sunset)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">UV Index</span>
          <span className="detail-value">--</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;