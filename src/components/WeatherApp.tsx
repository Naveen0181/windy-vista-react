import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Thermometer, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LocationSearch from "./LocationSearch";
import { CurrentWeather } from "./WeatherCard";
import WindAltitudeChart from "./WindAltitudeChart";
import WeatherForecast from "./WeatherForecast";
import { WeatherService } from "@/services/weatherService";
import { WeatherData, LocationSuggestion } from "@/types/weather";

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load default location (London) on app start
    handleLocationSelect({
      name: "London",
      country: "United Kingdom",
      lat: 51.5074,
      lon: -0.1278,
    });
  }, []);

  const handleLocationSelect = async (location: LocationSuggestion) => {
    setLoading(true);
    setSelectedLocation(location);
    
    try {
      const data = await WeatherService.getWeatherData(location.lat, location.lon);
      setWeatherData(data);
      
      toast({
        title: "Weather data updated",
        description: `Showing weather for ${data.location.name}`,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-background to-sky-medium/30 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Weather Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {getCurrentTime()}
          </p>
        </div>

        {/* Location Search */}
        <div className="flex justify-center">
          <LocationSearch onLocationSelect={handleLocationSelect} loading={loading} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading weather data...</span>
          </div>
        )}

        {weatherData && !loading && (
          <div className="space-y-8">
            {/* Current Location */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5" />
                  {weatherData.location.name}
                  {weatherData.location.country && (
                    <span className="text-muted-foreground font-normal">
                      , {weatherData.location.country}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Latitude: {weatherData.location.lat.toFixed(4)}°</span>
                  <span>Longitude: {weatherData.location.lon.toFixed(4)}°</span>
                </div>
              </CardContent>
            </Card>

            {/* Current Weather */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Thermometer className="h-6 w-6" />
                Current Conditions
              </h2>
              <CurrentWeather data={weatherData.current} />
            </div>

            {/* Wind at Different Altitudes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Wind Analysis</h2>
              <WindAltitudeChart data={weatherData.windAltitudes} />
            </div>

            {/* Weather Forecast */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Extended Forecast</h2>
              <WeatherForecast forecast={weatherData.forecast} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Weather data powered by Windy API • Location services by OpenStreetMap</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;