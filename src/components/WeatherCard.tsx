import type { WeatherData } from "../App";

interface WeatherCardProps {
  data: WeatherData;
}

function WeatherCard({ data }: WeatherCardProps) {
  const icon = data.weather[0]?.icon;
  const description = data.weather[0]?.description;

  // Hora local baseada no dt + timezone (segundos)
  const localDate = new Date((data.dt + (data.timezone || 0)) * 1000);
  const localTime = localDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="weather-card">
      <h2>
        {data.name}
        {data.sys?.country ? `, ${data.sys.country}` : ""}
      </h2>

      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
        />
      )}

      <p className="temp">{Math.round(data.main.temp)}°C</p>

      <p className="desc">{description}</p>

      <p>Sensação: {Math.round(data.main.feels_like)}°C</p>
      <p>Umidade: {data.main.humidity}%</p>
      <p>Vento: {data.wind.speed} m/s</p>

      <p>Hora local: {localTime}</p>

      {/* Mostra nascer/pôr do sol apenas se existirem */}
      {data.sys?.sunrise && data.sys?.sunset && (
        <div className="sun-times">
          <p>
            🌅 Nascer:{" "}
            {new Date(
              (data.sys.sunrise + (data.timezone || 0)) * 1000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p>
            🌇 Pôr:{" "}
            {new Date(
              (data.sys.sunset + (data.timezone || 0)) * 1000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
