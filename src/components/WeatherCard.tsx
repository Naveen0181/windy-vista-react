import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Gauge, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  className?: string;
  description?: string;
}

const WeatherCard = ({ title, value, unit, icon, className, description }: WeatherCardProps) => {
  return (
    <Card className={cn("bg-gradient-to-br from-card to-muted/50 shadow-soft", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface CurrentWeatherProps {
  data: {
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
  };
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <WeatherCard
        title="Temperature"
        value={Math.round(data.temp)}
        unit="°C"
        icon={<Thermometer className="h-4 w-4" />}
        className="bg-gradient-to-br from-sun/20 to-sky-light/30"
      />
      
      <WeatherCard
        title="Humidity"
        value={data.humidity}
        unit="%"
        icon={<Droplets className="h-4 w-4" />}
        className="bg-gradient-to-br from-sky-light/20 to-sky-medium/30"
      />
      
      <WeatherCard
        title="Pressure"
        value={data.pressure}
        unit="hPa"
        icon={<Gauge className="h-4 w-4" />}
        className="bg-gradient-to-br from-muted/50 to-secondary/30"
      />
      
      <WeatherCard
        title="Wind"
        value={Math.round(data.windSpeed * 3.6)}
        unit="km/h"
        icon={<Wind className="h-4 w-4" />}
        description={`${getWindDirection(data.windDirection)} (${Math.round(data.windDirection)}°)`}
        className="bg-gradient-to-br from-wind/20 to-accent/30"
      />
    </div>
  );
};

export { WeatherCard, CurrentWeather };