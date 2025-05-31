import { apiRequest } from "./queryClient";
import type { 
  FlightSearch, 
  HotelSearch, 
  ActivitySearch,
  Flight, 
  Hotel, 
  Activity, 
  Deal, 
  Trip,
  SavedTrip,
  User
} from "@shared/schema";

export class TravelService {
  static async searchFlights(searchData: FlightSearch): Promise<Flight[]> {
    const response = await apiRequest("POST", "/api/flights/search", searchData);
    return response.json();
  }

  static async searchHotels(searchData: HotelSearch): Promise<Hotel[]> {
    const response = await apiRequest("POST", "/api/hotels/search", searchData);
    return response.json();
  }

  static async searchActivities(searchData: ActivitySearch): Promise<Activity[]> {
    const response = await apiRequest("POST", "/api/activities/search", searchData);
    return response.json();
  }

  static async getDeals(type?: string): Promise<Deal[]> {
    const url = type ? `/api/deals?type=${type}` : "/api/deals";
    const response = await apiRequest("GET", url);
    return response.json();
  }

  static async getUserTrips(userId: number): Promise<Trip[]> {
    const response = await apiRequest("GET", `/api/trips/user/${userId}`);
    return response.json();
  }

  static async createTrip(tripData: any): Promise<Trip> {
    const response = await apiRequest("POST", "/api/trips", tripData);
    return response.json();
  }

  static async updateTrip(id: number, tripData: any): Promise<Trip> {
    const response = await apiRequest("PUT", `/api/trips/${id}`, tripData);
    return response.json();
  }

  static async deleteTrip(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/trips/${id}`);
  }

  static async getSavedTrips(userId: number): Promise<SavedTrip[]> {
    const response = await apiRequest("GET", `/api/saved-trips/user/${userId}`);
    return response.json();
  }

  static async saveTrip(savedTripData: any): Promise<SavedTrip> {
    const response = await apiRequest("POST", "/api/saved-trips", savedTripData);
    return response.json();
  }

  static async deleteSavedTrip(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/saved-trips/${id}`);
  }

  static async getUser(id: number): Promise<User> {
    const response = await apiRequest("GET", `/api/user/${id}`);
    return response.json();
  }

  static async updateUserPreferences(id: number, preferences: any): Promise<User> {
    const response = await apiRequest("PUT", `/api/user/${id}/preferences`, { preferences });
    return response.json();
  }

  static async getRecommendations(userId: number): Promise<Trip[]> {
    const response = await apiRequest("GET", `/api/recommendations/user/${userId}`);
    return response.json();
  }
}
