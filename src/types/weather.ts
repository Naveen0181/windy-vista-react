export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    windGust?: number;
  };
  forecast: WeatherForecast[];
  windAltitudes: WindAltitude[];
}

export interface WeatherForecast {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
}

export interface WindAltitude {
  altitude: number; // meters
  windSpeed: number; // m/s
  windDirection: number; // degrees
  label: string;
}

export interface LocationSuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}