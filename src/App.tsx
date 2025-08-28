import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  cod: number;
  message?: string;
}

function App() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${API_KEY}&units=metric&lang=pt_br`;

      const response = await fetch(url);
      const data: WeatherData = await response.json();

      if (data.cod !== 200) {
        setError(data.message || "Cidade não encontrada.");
        return;
      }

      setWeather(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar o clima. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Previsão do Tempo</h1>

      <SearchBar city={city} setCity={setCity} fetchWeather={fetchWeather} />

      {loading && <p className="loading-text">Carregando...</p>}
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
