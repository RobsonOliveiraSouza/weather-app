interface WeatherCardProps {
  data: {
    name: string;
    sys: { country: string };
    main: { temp: number; feels_like: number; humidity: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
    dt: number;
    timezone: number;
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const localTime = new Date((data.dt + data.timezone) * 1000)
    .toUTCString()
    .slice(-12, -4);

  return (
    <div className="weather-card">
      <h2>
        {data.name}, {data.sys.country}
      </h2>
      <p>{data.weather[0].description}</p>
      <img src={iconUrl} alt={data.weather[0].description} />
      <p>{Math.round(data.main.temp)}°C</p>
      <p>Sensação: {Math.round(data.main.feels_like)}°C</p>
      <p>Umidade: {data.main.humidity}%</p>
      <p>Vento: {data.wind.speed} m/s</p>
      <p>Hora local: {localTime}</p>
    </div>
  );
};

export default WeatherCard;
