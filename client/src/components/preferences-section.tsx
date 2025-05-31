import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TravelService } from "@/lib/travel-service";
import { LocalStorageService } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";

export default function PreferencesSection() {
  const { toast } = useToast();
  const user = LocalStorageService.getUser();
  
  const [preferences, setPreferences] = useState({
    travelStyle: [] as string[],
    budget: "",
    accommodation: "",
    destinations: [] as string[],
    alerts: [] as string[]
  });

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const savePreferences = useMutation({
    mutationFn: (prefs: any) => TravelService.updateUserPreferences(user?.id || 1, prefs),
    onSuccess: (updatedUser) => {
      // Update local storage
      const localUser = LocalStorageService.getUser();
      if (localUser) {
        localUser.preferences = preferences;
        LocalStorageService.setUser(localUser);
      }
      
      toast({
        title: "Preferences Saved",
        description: "Your travel preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleTravelStyleChange = (style: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      travelStyle: checked 
        ? [...prev.travelStyle, style]
        : prev.travelStyle.filter(s => s !== style)
    }));
  };

  const handleDestinationChange = (destination: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      destinations: checked 
        ? [...prev.destinations, destination]
        : prev.destinations.filter(d => d !== destination)
    }));
  };

  const handleAlertChange = (alert: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      alerts: checked 
        ? [...prev.alerts, alert]
        : prev.alerts.filter(a => a !== alert)
    }));
  };

  const handleSave = () => {
    savePreferences.mutate(preferences);
  };

  const travelStyles = [
    "Adventure & Outdoor",
    "Cultural & Historic",
    "Beach & Relaxation",
    "Food & Wine",
    "Urban & City"
  ];

  const destinationOptions = [
    "Europe",
    "Asia",
    "North America",
    "South America",
    "Africa",
    "Oceania"
  ];

  const alertOptions = [
    "Price drop alerts",
    "New deals notifications",
    "Trip reminders",
    "Weather updates"
  ];

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Travel Style</h4>
            <div className="space-y-3">
              {travelStyles.map((style) => (
                <div key={style} className="flex items-center space-x-3">
                  <Checkbox
                    id={style}
                    checked={preferences.travelStyle.includes(style)}
                    onCheckedChange={(checked) => handleTravelStyleChange(style, checked as boolean)}
                  />
                  <Label htmlFor={style} className="text-gray-700">{style}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Range</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Per Trip Budget</Label>
                <Select value={preferences.budget} onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                    <SelectItem value="$1,000 - $2,500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="$2,500 - $5,000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="$5,000+">$5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Type</Label>
                <Select value={preferences.accommodation} onValueChange={(value) => setPreferences(prev => ({ ...prev, accommodation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget (Hostels, 2★ Hotels)">Budget (Hostels, 2★ Hotels)</SelectItem>
                    <SelectItem value="Mid-range (3★ Hotels, B&Bs)">Mid-range (3★ Hotels, B&Bs)</SelectItem>
                    <SelectItem value="Luxury (4-5★ Hotels, Resorts)">Luxury (4-5★ Hotels, Resorts)</SelectItem>
                    <SelectItem value="Mixed (Varies by destination)">Mixed (Varies by destination)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferred Destinations</h4>
            <div className="space-y-3">
              {destinationOptions.map((destination) => (
                <div key={destination} className="flex items-center space-x-3">
                  <Checkbox
                    id={destination}
                    checked={preferences.destinations.includes(destination)}
                    onCheckedChange={(checked) => handleDestinationChange(destination, checked as boolean)}
                  />
                  <Label htmlFor={destination} className="text-gray-700">{destination}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Travel Alerts</h4>
            <div className="space-y-3">
              {alertOptions.map((alert) => (
                <div key={alert} className="flex items-center space-x-3">
                  <Checkbox
                    id={alert}
                    checked={preferences.alerts.includes(alert)}
                    onCheckedChange={(checked) => handleAlertChange(alert, checked as boolean)}
                  />
                  <Label htmlFor={alert} className="text-gray-700">{alert}</Label>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleSave}
              disabled={savePreferences.isPending}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              {savePreferences.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
