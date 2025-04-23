import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [cordinates, setCordinates] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // NEW

  const state = "";
  const country = "IN";
  const limit = 1;
  const API_KEY = "219c0e28819f4281037fdb8283b85400";

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setWeather(null);
    setError("");
    setLoading(true);

    if (!city.trim()) {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }

    const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid=${API_KEY}`;

    fetch(geoAPI)
      .then((response) => {
        if (!response.ok) throw new Error("Geo API response not OK");
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setError("City not found. Please try again.");
          setLoading(false);
          return;
        }

        const { lat, lon } = data[0];
        setCordinates({ lat, lon });

        const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;

        fetch(weatherAPI)
          .then((response) => {
            if (!response.ok) throw new Error("Weather API response not OK");
            return response.json();
          })
          .then((data) => {
            setWeather(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Weather fetch error:", error);
            setError("Error fetching weather data.");
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Geo fetch error:", error);
        setError("Failed to fetch location data.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-blue-500 text-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 my-6">Weather App</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <select
          name="lang"
          id="lang"
          onChange={(e) => setLang(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Get Weather
        </button>
      </form>

      {error && (
        <div className="mt-4 text-center text-red-200 bg-red-800/30 border border-red-300 p-2 rounded-lg max-w-md w-full">
          {error}
        </div>
      )}

      {loading && <div className="mt-4 text-white">Loading...</div>}

      {hasSearched && !loading && !weather && !error && (
        <div className="mt-4 text-white">No weather data found</div>
      )}

      {weather && weather.main && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Weather in {weather.name}
          </h2>
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>📊 Pressure: {weather.main.pressure} hPa</p>
          <p>🌤 Description: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
