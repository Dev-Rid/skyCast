import axios from 'axios';

const API_KEY = '2c8b8c8b1c4c4d8b3b3c3e3f3g3h3i3j'; // Demo key - replace with your own
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getWeatherByCity(city, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: units
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (error.response?.status === 401) {
        throw new Error('API key error. Please check your configuration.');
      }
      throw new Error('Unable to fetch weather data. Please try again.');
    }
  }

  async getWeatherByCoords(lat, lon, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          units: units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch weather data for your location.');
    }
  }

  async getForecastByCity(city, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch forecast data.');
    }
  }

  async getForecastByCoords(lat, lon, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          units: units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch forecast data.');
    }
  }
}

export default new WeatherService();