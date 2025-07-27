import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherForecast as ForecastType } from "@/types/weather";
import { Calendar, Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  forecast: ForecastType[];
}

const WeatherForecast = ({ forecast }: WeatherForecastProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <Card className="bg-gradient-to-br from-sky-light/10 to-sky-medium/20 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 rounded-lg bg-card/60 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="text-sm font-medium min-w-0">
                  {formatDate(day.date)}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-sun" />
                  <span className="font-medium">{Math.round(day.temp.max)}°</span>
                  <span className="text-muted-foreground">/{Math.round(day.temp.min)}°</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-sky-medium" />
                  <span>{day.humidity}%</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-wind" />
                  <span>{Math.round(day.windSpeed * 3.6)} km/h</span>
                  <span className="text-xs text-muted-foreground">
                    {getWindDirection(day.windDirection)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;