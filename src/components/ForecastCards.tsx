import type { ForecastData } from "../App";

interface ForecastCardsProps {
  data: ForecastData;
}

function ForecastCards({ data }: ForecastCardsProps) {
  // Pega ~1 leitura por dia (cada 3h => 8 leituras = 24h)
  const daily = data.list.filter((_, i) => i % 8 === 0);

  return (
    <div className="forecast-cards-container">
      {daily.map((item, idx) => {
        const date = new Date((item.dt + data.city.timezone) * 1000);
        const dayStr = date.toLocaleDateString([], {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        });
        const icon = item.weather[0]?.icon;
        const desc = item.weather[0]?.description;

        return (
          <div key={idx} className="forecast-card">
            <p className="forecast-date">{dayStr}</p>
            {icon && (
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={desc}
              />
            )}
            <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
            <p className="forecast-desc">{desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastCards;
