import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Hotel, MapPin, Package, Search, PlaneTakeoff, PlaneLanding } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TravelService } from "@/lib/travel-service";
import { LocalStorageService } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";
import type { FlightSearch, HotelSearch, ActivitySearch } from "@shared/schema";

export default function SearchSection() {
  const [activeSearchTab, setActiveSearchTab] = useState("flights");
  const [flightSearch, setFlightSearch] = useState<FlightSearch>({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    class: "economy"
  });
  const [hotelSearch, setHotelSearch] = useState<HotelSearch>({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1
  });
  const [activitySearch, setActivitySearch] = useState<ActivitySearch>({
    destination: "",
    type: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const flightSearchMutation = useMutation({
    mutationFn: TravelService.searchFlights,
    onSuccess: (data) => {
      toast({
        title: "Search Complete",
        description: `Found ${data.length} flights`,
      });
      LocalStorageService.addSearchHistory({
        type: "flights",
        query: flightSearch,
        timestamp: new Date().toISOString()
      });
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Please check your search parameters and try again.",
        variant: "destructive"
      });
    }
  });

  const hotelSearchMutation = useMutation({
    mutationFn: TravelService.searchHotels,
    onSuccess: (data) => {
      toast({
        title: "Search Complete",
        description: `Found ${data.length} hotels`,
      });
      LocalStorageService.addSearchHistory({
        type: "hotels",
        query: hotelSearch,
        timestamp: new Date().toISOString()
      });
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Please check your search parameters and try again.",
        variant: "destructive"
      });
    }
  });

  const activitySearchMutation = useMutation({
    mutationFn: TravelService.searchActivities,
    onSuccess: (data) => {
      toast({
        title: "Search Complete",
        description: `Found ${data.length} activities`,
      });
      LocalStorageService.addSearchHistory({
        type: "activities",
        query: activitySearch,
        timestamp: new Date().toISOString()
      });
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Please check your search parameters and try again.",
        variant: "destructive"
      });
    }
  });

  const handleFlightSearch = () => {
    if (!flightSearch.from || !flightSearch.to || !flightSearch.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    flightSearchMutation.mutate(flightSearch);
  };

  const handleHotelSearch = () => {
    if (!hotelSearch.destination || !hotelSearch.checkIn || !hotelSearch.checkOut) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    hotelSearchMutation.mutate(hotelSearch);
  };

  const handleActivitySearch = () => {
    if (!activitySearch.destination) {
      toast({
        title: "Missing Information",
        description: "Please enter a destination.",
        variant: "destructive"
      });
      return;
    }
    activitySearchMutation.mutate(activitySearch);
  };

  const searchTabs = [
    { id: "flights", label: "Flights", icon: Plane },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "activities", label: "Activities", icon: MapPin },
    { id: "packages", label: "Packages", icon: Package },
  ];

  return (
    <section className="mb-12">
      {/* Hero Image */}
      <div 
        className="relative bg-cover bg-center h-96 rounded-2xl overflow-hidden mb-8"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Where to next?</h2>
            <p className="text-xl md:text-2xl mb-8">Discover amazing destinations and create unforgettable memories</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Search Tabs */}
          <div className="flex space-x-8 mb-6 border-b border-gray-200">
            {searchTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSearchTab(tab.id)}
                  className={`pb-4 px-2 font-medium transition-colors flex items-center ${
                    activeSearchTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Flight Search Form */}
          {activeSearchTab === "flights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">From</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter departure city"
                    value={flightSearch.from}
                    onChange={(e) => setFlightSearch({ ...flightSearch, from: e.target.value })}
                    className="pr-10"
                  />
                  <PlaneTakeoff className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">To</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter destination"
                    value={flightSearch.to}
                    onChange={(e) => setFlightSearch({ ...flightSearch, to: e.target.value })}
                    className="pr-10"
                  />
                  <PlaneLanding className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Departure</Label>
                <Input
                  type="date"
                  value={flightSearch.departureDate}
                  onChange={(e) => setFlightSearch({ ...flightSearch, departureDate: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Return</Label>
                <Input
                  type="date"
                  value={flightSearch.returnDate}
                  onChange={(e) => setFlightSearch({ ...flightSearch, returnDate: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Passengers</Label>
                <Select value={flightSearch.passengers.toString()} onValueChange={(value) => setFlightSearch({ ...flightSearch, passengers: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Adult</SelectItem>
                    <SelectItem value="2">2 Adults</SelectItem>
                    <SelectItem value="3">3 Adults</SelectItem>
                    <SelectItem value="4">4+ Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Class</Label>
                <Select value={flightSearch.class} onValueChange={(value: "economy" | "business" | "first") => setFlightSearch({ ...flightSearch, class: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-4 flex items-end">
                <Button 
                  onClick={handleFlightSearch}
                  disabled={flightSearchMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {flightSearchMutation.isPending ? "Searching..." : "Search Flights"}
                </Button>
              </div>
            </div>
          )}

          {/* Hotel Search Form */}
          {activeSearchTab === "hotels" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">Destination</Label>
                <Input
                  placeholder="Where are you going?"
                  value={hotelSearch.destination}
                  onChange={(e) => setHotelSearch({ ...hotelSearch, destination: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Check-in</Label>
                <Input
                  type="date"
                  value={hotelSearch.checkIn}
                  onChange={(e) => setHotelSearch({ ...hotelSearch, checkIn: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Check-out</Label>
                <Input
                  type="date"
                  value={hotelSearch.checkOut}
                  onChange={(e) => setHotelSearch({ ...hotelSearch, checkOut: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Guests</Label>
                <Select value={hotelSearch.guests.toString()} onValueChange={(value) => setHotelSearch({ ...hotelSearch, guests: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Rooms</Label>
                <Select value={hotelSearch.rooms.toString()} onValueChange={(value) => setHotelSearch({ ...hotelSearch, rooms: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Room</SelectItem>
                    <SelectItem value="2">2 Rooms</SelectItem>
                    <SelectItem value="3">3+ Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2 flex items-end">
                <Button 
                  onClick={handleHotelSearch}
                  disabled={hotelSearchMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {hotelSearchMutation.isPending ? "Searching..." : "Search Hotels"}
                </Button>
              </div>
            </div>
          )}

          {/* Activity Search Form */}
          {activeSearchTab === "activities" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Destination</Label>
                <Input
                  placeholder="Where do you want to explore?"
                  value={activitySearch.destination}
                  onChange={(e) => setActivitySearch({ ...activitySearch, destination: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</Label>
                <Select value={activitySearch.type} onValueChange={(value) => setActivitySearch({ ...activitySearch, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleActivitySearch}
                  disabled={activitySearchMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {activitySearchMutation.isPending ? "Searching..." : "Search Activities"}
                </Button>
              </div>
            </div>
          )}

          {/* Packages Search Form */}
          {activeSearchTab === "packages" && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Package Deals Coming Soon</h3>
              <p className="text-gray-600">We're working on bringing you the best travel packages. Stay tuned!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
