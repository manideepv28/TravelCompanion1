import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import { TravelService } from "@/lib/travel-service";
import { LocalStorageService } from "@/lib/local-storage";
import { useState } from "react";

export default function RecommendationsSection() {
  const user = LocalStorageService.getUser();
  const [favorites, setFavorites] = useState<number[]>(LocalStorageService.getFavorites());

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/recommendations/user", user?.id || 1],
    queryFn: () => TravelService.getRecommendations(user?.id || 1),
  });

  const toggleFavorite = (tripId: number) => {
    if (LocalStorageService.isFavorite(tripId)) {
      LocalStorageService.removeFavorite(tripId);
      setFavorites(favorites.filter(id => id !== tripId));
    } else {
      LocalStorageService.addFavorite(tripId);
      setFavorites([...favorites, tripId]);
    }
  };

  const recommendationImages = [
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1555993539-1732b0258235?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  ];

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recommended for you</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
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
        <h3 className="text-2xl font-bold text-gray-900">Recommended for you</h3>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          View all
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations?.slice(0, 6).map((recommendation, index) => {
          const isFavorite = LocalStorageService.isFavorite(recommendation.id);
          return (
            <Card key={recommendation.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={recommendationImages[index % recommendationImages.length]} 
                alt={recommendation.destination}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{recommendation.destination}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {recommendation.startDate && recommendation.endDate 
                    ? `${Math.ceil((new Date(recommendation.endDate).getTime() - new Date(recommendation.startDate).getTime()) / (1000 * 3600 * 24))} days`
                    : "Flexible duration"
                  } • Flights + Hotels + Activities
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      ${recommendation.totalPrice}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">per person</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(recommendation.id)}
                    className={`${
                      isFavorite 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
