import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus } from "lucide-react";
import { TravelService } from "@/lib/travel-service";
import { LocalStorageService } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";

export default function TripsSection() {
  const user = LocalStorageService.getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery({
    queryKey: ["/api/trips/user", user?.id || 1],
    queryFn: () => TravelService.getUserTrips(user?.id || 1),
  });

  const deleteTrip = useMutation({
    mutationFn: TravelService.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips/user", user?.id || 1] });
      toast({
        title: "Trip Deleted",
        description: "Your trip has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return { variant: "default" as const, label: "UPCOMING" };
      case "completed":
        return { variant: "secondary" as const, label: "COMPLETED" };
      case "saved":
        return { variant: "outline" as const, label: "SAVED" };
      default:
        return { variant: "secondary" as const, label: "UNKNOWN" };
    }
  };

  const tripImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1555993539-1732b0258235?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
  ];

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">My Trips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">My Trips</h3>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Plan New Trip
        </Button>
      </div>

      {!trips || trips.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <MapPin className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips yet</h3>
            <p className="mb-4">Start planning your next adventure!</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Plan Your First Trip
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => {
            const statusBadge = getStatusBadge(trip.status);
            return (
              <Card key={trip.id} className="overflow-hidden">
                <img
                  src={tripImages[index % tripImages.length]}
                  alt={trip.destination}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{trip.name}</h4>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    {trip.startDate && trip.endDate ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Flexible dates</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {trip.status === "upcoming" ? (
                      <>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            // Handle edit trip
                            toast({
                              title: "Edit Trip",
                              description: "Trip editing feature coming soon!",
                            });
                          }}
                        >
                          Edit Trip
                        </Button>
                      </>
                    ) : trip.status === "completed" ? (
                      <>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          View Photos
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Book Again
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Compare
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
