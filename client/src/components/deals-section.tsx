import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Package } from "lucide-react";
import { TravelService } from "@/lib/travel-service";

export default function DealsSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: deals, isLoading } = useQuery({
    queryKey: ["/api/deals", activeFilter],
    queryFn: () => TravelService.getDeals(activeFilter === "all" ? undefined : activeFilter),
  });

  const filters = [
    { id: "all", label: "All" },
    { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" },
    { id: "activities", label: "Activities" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flights":
        return Plane;
      case "hotels":
        return Hotel;
      case "activities":
        return MapPin;
      case "packages":
        return Package;
      default:
        return Package;
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "30% OFF":
        return "destructive";
      case "LIMITED":
        return "secondary";
      case "POPULAR":
        return "default";
      case "FLASH SALE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Today's Best Deals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
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
        <h3 className="text-2xl font-bold text-gray-900">Today's Best Deals</h3>
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals?.map((deal) => {
          const TypeIcon = getTypeIcon(deal.type);
          return (
            <Card key={deal.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={deal.imageUrl || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05"}
                alt={deal.title}
                className="w-full h-32 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  {deal.badge && (
                    <Badge variant={getBadgeVariant(deal.badge)} className="text-xs">
                      {deal.badge}
                    </Badge>
                  )}
                  <TypeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{deal.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{deal.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      ${deal.currentPrice}
                    </span>
                    {deal.originalPrice !== deal.currentPrice && (
                      <span className="text-sm text-gray-500 line-through ml-1">
                        ${deal.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Book
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
