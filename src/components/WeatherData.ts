export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
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
}
