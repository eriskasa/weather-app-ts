import { ClipLoader } from "react-spinners";
import React, {useState} from "react";
import { WeatherData } from "../types";

const Weather: React.FC = () => { 

  const [ city, setCity ] = useState<string>('');
  const [ weatherData, setWeatherData ] = useState<WeatherData | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');

  const featchWeather = async () => {
    if (!city ) return setError("Value not found");

    setIsLoading(true);
    setError('');

    // const API_KEY = "27e72641c8517c7a6ef0a8c6e0a0ed39";
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27e72641c8517c7a6ef0a8c6e0a0ed39`
      )
      const data = await response.json();

      if (data.cod === '404') {
        setError("city not found");
      } else  {
        setWeatherData(data);
      }
    } catch (err) {
      setError("Faild to get data");
    } finally {
      setIsLoading(false);
    }

  };

  const handleClearInout = () => {
    setCity('');
    setWeatherData(null);
    setError('');
  }



  return (
    <div style={{ textAlign: "center", marginTop: '50px', height: "1000px", width: "100%"}}>
      <h1>Weather App</h1>
      <input 
      type="text"
      value={city}
      placeholder="enter citty"
      onChange={(e) => setCity(e.target.value)}
      style={{padding: "10px" , fontSize: "16px", width: "80%",marginBottom: "1.4rem" }} />
      <button 
      onClick={featchWeather}
      style={{ padding: "10px 32px", fontSize: "16px", marginLeft: "10px"}}
      >Search</button>
      <button 
      onClick={handleClearInout}
      style={{ padding: " 10px 32px", fontSize: "16px", marginLeft: "10px"}}
      >Clear</button>
      
      {isLoading && <ClipLoader color="green" size={80}  />}
      { error && (<div>
        <p style={{color: "red"}}>{error}</p>
        <button
         onClick={featchWeather}
         style={{padding: "10px 32px", background: "black", }}
        >Try Again</button>
      </div>)}

      {weatherData && (
        <div style={{marginTop: "42px", background: "black", padding: "1rem", borderRadius: "7px", width:"100%",}}>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Feels Like: {Math.round(weatherData.main.feels_like - 273.15)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <img
          width="150px"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
        </div>
      )}
    </div>
  )

}

export default Weather;