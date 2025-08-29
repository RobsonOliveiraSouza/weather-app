import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCards from "./components/ForecastCards";
import ErrorMessage from "./components/ErrorMessage";

// Tipo para previsão atual (Daily)
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min?: number;
    temp_max?: number;
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
  sys?: {
    country: string;
    sunrise?: number;
    sunset?: number;
  };
  timezone: number;
  cod: number;
  message?: string;
}

// Tipo para previsão de 5 dias (Forecast)
export interface ForecastData {
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise?: number;
    sunset?: number;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      temp_min?: number;
      temp_max?: number;
    };
    weather: {
      description: string;
      icon: string;
      main: string;
    }[];
    wind: {
      speed: number;
    };
  }[];
  cod: string; // "200" quando sucesso
  message: number;
}

function App() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [mode, setMode] = useState<"daily" | "5days">("daily");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Busca conforme o modo atual
  const fetchWeather = async (
    cityName: string,
    currentMode: "daily" | "5days" = mode
  ) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast(null);

      // Se o usuário não especificar país, a API pega o primeiro resultado
      // Se quiser o Brasil (ou outro), deve digitar "Cidade,BR"
      const query = cityName.trim();

      const url =
        currentMode === "daily"
          ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              query
            )}&appid=${API_KEY}&units=metric&lang=pt_br`
          : `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
              query
            )}&appid=${API_KEY}&units=metric&lang=pt_br`;

      const response = await fetch(url);
      const data = await response.json();

      // /weather => cod: number; /forecast => cod: string
      const ok =
        (typeof data.cod === "number" && data.cod === 200) ||
        (typeof data.cod === "string" && data.cod === "200");

      if (!ok) {
        setError(data.message || "Cidade não encontrada.");
        return;
      }

      if (currentMode === "daily") {
        setWeather(data as WeatherData);
      } else {
        setForecast(data as ForecastData);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar o clima. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Ao trocar o modo, refaz a busca para a cidade atual
  useEffect(() => {
    if (city.trim()) {
      fetchWeather(city, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="app-container">
      <h1 className="app-title">Previsão do Tempo</h1>

      <div className="search-mode-container">
        <SearchBar city={city} setCity={setCity} fetchWeather={fetchWeather} />
        <div className="mode-buttons">
          <button
            className={mode === "daily" ? "active" : ""}
            onClick={() => setMode("daily")}
          >
            Diário
          </button>
          <button
            className={mode === "5days" ? "active" : ""}
            onClick={() => setMode("5days")}
          >
            5 Dias
          </button>
        </div>
      </div>

      {loading && <p className="loading-text">Carregando...</p>}
      {error && <ErrorMessage message={error} />}

      {mode === "daily" && weather && <WeatherCard data={weather} />}

      {mode === "5days" && forecast && <ForecastCards data={forecast} />}
    </div>
  );
}

export default App;
