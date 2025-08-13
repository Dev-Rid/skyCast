import React from 'react';

const Forecast = ({ forecast, unit }) => {
  if (!forecast || !forecast.list) return null;

  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  
  // Group forecast by day (take one entry per day, preferably around noon)
  const dailyForecast = [];
  const processedDays = new Set();
  
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!processedDays.has(dayKey) && dailyForecast.length < 5) {
      dailyForecast.push(item);
      processedDays.add(dayKey);
    }
  });

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-list">
        {dailyForecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-day">
              {formatDay(day.dt)}
            </div>
            
            <div className="forecast-icon">
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
            </div>
            
            <div className="forecast-temps">
              <span className="temp-high">{Math.round(day.main.temp_max)}{unitSymbol}</span>
              <span className="temp-low">{Math.round(day.main.temp_min)}{unitSymbol}</span>
            </div>
            
            <div className="forecast-condition">
              {day.weather[0].main}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;