import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WindAltitude } from "@/types/weather";
import { Wind, Navigation } from "lucide-react";

interface WindAltitudeChartProps {
  data: WindAltitude[];
}

const WindAltitudeChart = ({ data }: WindAltitudeChartProps) => {
  const maxSpeed = Math.max(...data.map(d => d.windSpeed));

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <Card className="bg-gradient-to-br from-wind/10 to-sky-light/20 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Wind at Different Altitudes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((altitude, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium min-w-0 flex-1">
                  {altitude.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {altitude.altitude}m
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    {Math.round(altitude.windSpeed * 3.6)} km/h
                  </div>
                  <div 
                    className="h-2 bg-gradient-to-r from-wind to-accent rounded-full"
                    style={{ 
                      width: `${(altitude.windSpeed / maxSpeed) * 60}px`,
                      minWidth: '10px'
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Navigation 
                    className="h-4 w-4 text-wind" 
                    style={{ 
                      transform: `rotate(${altitude.windDirection}deg)` 
                    }}
                  />
                  <span className="text-xs text-muted-foreground min-w-0">
                    {getWindDirection(altitude.windDirection)}
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

export default WindAltitudeChart;