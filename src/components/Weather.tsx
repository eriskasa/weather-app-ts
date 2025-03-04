import { ClipLoader } from "react-spinners";
import React, { useState } from "react";
import { WeatherData, ForecastData } from "../types";
import "./Weather.css"; // Import the CSS file

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const fetchWeather = async () => {
    if (!city) return setError("Please enter a city name.");

    setIsLoading(true);
    setError("");

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27e72641c8517c7a6ef0a8c6e0a0ed39`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=27e72641c8517c7a6ef0a8c6e0a0ed39`
        ),
      ]);

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (weatherData.cod === "404" || forecastData.cod === "404") {
        setError("City not found. Please try again.");
      } else {
        setLastUpdated(new Date().toLocaleString());
        setWeatherData(weatherData);
        setForecastData(forecastData);
      }
    } catch (err) {
      setError("Failed to fetch data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInput = () => {
    setCity("");
    setWeatherData(null);
    setForecastData(null);
    setError("");
  };

  const convertTemp = (temp: number, unit: "C" | "F"): number => {
    return unit === "C"
      ? Math.round(temp - 273.15)
      : Math.round(((temp - 273.15) * 9) / 5 + 32);
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>

      <div className="input-container">
        <input
          type="text"
          value={city}
          placeholder="Enter city"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
        <button onClick={handleClearInput}>Clear</button>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as "C" | "F")}
        >
          <option value="C">Celsius</option>
          <option value="F">Fahrenheit</option>
        </select>
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <ClipLoader color="#36D7B7" size={50} />
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchWeather}>Try Again</button>
        </div>
      )}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <button
            className="favorite-button"
            onClick={() => setFavorites([...favorites, city])}
          >
            Add to Favorites
          </button>
          <p>Temperature: {convertTemp(weatherData.main.temp, unit)}°{unit}</p>
          <p>Feels Like: {convertTemp(weatherData.main.feels_like, unit)}°{unit}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Last Updated: {lastUpdated}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
        </div>
      )}

      {forecastData && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecastData.list
              .filter((item, index) => index % 8 === 0)
              .map((item) => (
                <div key={item.dt_txt} className="forecast-item">
                  <p>Date: {new Date(item.dt_txt).toLocaleDateString()}</p>
                  <p>Temperature: {convertTemp(item.main.temp, unit)}°{unit}</p>
                  <p>Condition: {item.weather[0].description}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="Weather icon"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="favorites">
        <h3>Favorites</h3>
        <ul>
          {favorites.map((fav) => (
            <li key={fav} onClick={() => setCity(fav)}>
              {fav}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Weather;