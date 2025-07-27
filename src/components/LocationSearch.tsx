import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocationSuggestion } from "@/types/weather";

interface LocationSearchProps {
  onLocationSelect: (location: LocationSuggestion) => void;
  loading?: boolean;
}

const LocationSearch = ({ onLocationSelect, loading }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Using OpenStreetMap Nominatim API for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const locations: LocationSuggestion[] = data.map((item: any) => ({
        name: item.display_name.split(',')[0],
        country: item.address?.country || '',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
      
      setSuggestions(locations);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    searchLocations(value);
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setQuery(`${location.name}, ${location.country}`);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect({
            name: "Current Location",
            country: "",
            lat: latitude,
            lon: longitude,
          });
          setQuery("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-12 bg-card"
          disabled={loading}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={getCurrentLocation}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-auto">
          {suggestions.map((location, index) => (
            <div
              key={index}
              className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="font-medium">{location.name}</div>
              {location.country && (
                <div className="text-sm text-muted-foreground">{location.country}</div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;