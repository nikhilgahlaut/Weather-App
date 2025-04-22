import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [cordinates, setCordinates] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // NEW STATE

  const state = "";
  const country = "IN";
  const limit = 1;
  const API_KEY = "219c0e28819f4281037fdb8283b85400";

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true); // mark that a search has been made

    const API = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid=${API_KEY}`;

    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCordinates({ lat, lon });

          const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

          fetch(weatherAPI)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setWeather(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
        } else {
          setWeather(null); // ensure weather is null if no location is found
          console.log("No data found");
        }
      })
      .catch((error) => console.error("Error fetching coordinates:", error));
  };

  return (
    <>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {hasSearched && !weather && (
        <div>No weather data found</div>
      )}

      {weather && weather.main && (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Description: {weather.weather[0].description}</p>
        </div>
      )}
    </>
  );
}

export default App;
