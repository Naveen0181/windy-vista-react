import { WeatherData, WeatherForecast, WindAltitude, LocationSuggestion } from "@/types/weather";

const WINDY_API_KEY = "xhosWg3r4B3z674FmHu4JpGhJbKo1nOV";
const BASE_URL = "https://api.windy.com/api/point-forecast/v2";

export class WeatherService {
  static async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      // Get current weather and forecast data from Windy API
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: WINDY_API_KEY,
          lat: lat,
          lon: lon,
          model: 'gfs',
          parameters: ['temp', 'wind', 'windDir', 'pressure', 'rh', 'windGust'],
          levels: ['surface', '1000h', '925h', '850h', '700h', '500h'],
        })
      });

      if (!response.ok) {
        throw new Error(`Windy API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get location name using reverse geocoding
      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const locationData = await locationResponse.json();

      return this.transformWindyData(data, locationData, lat, lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback to mock data if API fails
      return this.getMockWeatherData(lat, lon);
    }
  }

  private static transformWindyData(windyData: any, locationData: any, lat: number, lon: number): WeatherData {
    const ts = windyData.ts || [];
    const temp = windyData['temp-surface'] || [];
    const wind = windyData['wind-surface'] || [];
    const windDir = windyData['windDir-surface'] || [];
    const pressure = windyData['pressure-surface'] || [];
    const rh = windyData['rh-surface'] || [];

    // Current conditions (first data point)
    const current = {
      temp: temp[0] - 273.15, // Convert from Kelvin to Celsius
      humidity: rh[0],
      pressure: pressure[0] / 100, // Convert from Pa to hPa
      windSpeed: wind[0],
      windDirection: windDir[0],
    };

    // Generate forecast for next 7 days
    const forecast: WeatherForecast[] = [];
    for (let i = 0; i < Math.min(7, ts.length); i += 8) { // Every 8th point for daily data
      const date = new Date(ts[i] * 1000);
      forecast.push({
        date: date.toISOString(),
        temp: {
          min: (temp[i] - 273.15) - 5, // Approximate min temp
          max: (temp[i] - 273.15) + 3, // Approximate max temp
        },
        humidity: rh[i] || current.humidity,
        pressure: (pressure[i] || current.pressure * 100) / 100,
        windSpeed: wind[i] || current.windSpeed,
        windDirection: windDir[i] || current.windDirection,
        description: this.getWeatherDescription(temp[i] - 273.15, rh[i]),
      });
    }

    // Wind at different altitudes
    const windAltitudes: WindAltitude[] = [
      {
        altitude: 0,
        windSpeed: current.windSpeed,
        windDirection: current.windDirection,
        label: "Surface"
      },
      {
        altitude: 1000,
        windSpeed: (windyData['wind-1000h']?.[0] || current.windSpeed) * 1.2,
        windDirection: windyData['windDir-1000h']?.[0] || current.windDirection,
        label: "1000m"
      },
      {
        altitude: 2000,
        windSpeed: (windyData['wind-925h']?.[0] || current.windSpeed) * 1.4,
        windDirection: windyData['windDir-925h']?.[0] || current.windDirection,
        label: "2000m"
      },
      {
        altitude: 3000,
        windSpeed: (windyData['wind-850h']?.[0] || current.windSpeed) * 1.6,
        windDirection: windyData['windDir-850h']?.[0] || current.windDirection,
        label: "3000m"
      },
      {
        altitude: 5000,
        windSpeed: (windyData['wind-700h']?.[0] || current.windSpeed) * 1.8,
        windDirection: windyData['windDir-700h']?.[0] || current.windDirection,
        label: "5000m"
      },
      {
        altitude: 8000,
        windSpeed: (windyData['wind-500h']?.[0] || current.windSpeed) * 2.0,
        windDirection: windyData['windDir-500h']?.[0] || current.windDirection,
        label: "8000m"
      }
    ];

    return {
      location: {
        name: locationData.display_name?.split(',')[0] || 'Unknown Location',
        country: locationData.address?.country || '',
        lat,
        lon,
      },
      current,
      forecast,
      windAltitudes,
    };
  }

  private static getWeatherDescription(temp: number, humidity: number): string {
    if (temp > 25) return "Warm";
    if (temp < 0) return "Freezing";
    if (humidity > 80) return "Humid";
    if (humidity < 30) return "Dry";
    return "Moderate";
  }

  // Mock data for fallback
  private static getMockWeatherData(lat: number, lon: number): WeatherData {
    const current = {
      temp: 22,
      humidity: 65,
      pressure: 1013,
      windSpeed: 12,
      windDirection: 225,
    };

    const forecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      temp: {
        min: current.temp - 5 + Math.random() * 3,
        max: current.temp + 3 + Math.random() * 5,
      },
      humidity: current.humidity + Math.random() * 20 - 10,
      pressure: current.pressure + Math.random() * 20 - 10,
      windSpeed: current.windSpeed + Math.random() * 10 - 5,
      windDirection: current.windDirection + Math.random() * 60 - 30,
      description: "Partly cloudy",
    }));

    const windAltitudes: WindAltitude[] = [
      { altitude: 0, windSpeed: 12, windDirection: 225, label: "Surface" },
      { altitude: 1000, windSpeed: 15, windDirection: 230, label: "1000m" },
      { altitude: 2000, windSpeed: 18, windDirection: 235, label: "2000m" },
      { altitude: 3000, windSpeed: 22, windDirection: 240, label: "3000m" },
      { altitude: 5000, windSpeed: 28, windDirection: 245, label: "5000m" },
      { altitude: 8000, windSpeed: 35, windDirection: 250, label: "8000m" },
    ];

    return {
      location: {
        name: "Demo Location",
        country: "Demo Country",
        lat,
        lon,
      },
      current,
      forecast,
      windAltitudes,
    };
  }
}