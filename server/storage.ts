import { 
  users, trips, flights, hotels, activities, deals, savedTrips,
  type User, type Trip, type Flight, type Hotel, type Activity, type Deal, type SavedTrip,
  type InsertUser, type InsertTrip, type InsertFlight, type InsertHotel, 
  type InsertActivity, type InsertDeal, type InsertSavedTrip,
  type FlightSearch, type HotelSearch, type ActivitySearch
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: string): Promise<User | undefined>;

  // Trip operations
  getTrip(id: number): Promise<Trip | undefined>;
  getUserTrips(userId: number): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;

  // Flight operations
  searchFlights(search: FlightSearch): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Hotel operations
  searchHotels(search: HotelSearch): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;

  // Activity operations
  searchActivities(search: ActivitySearch): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Deal operations
  getDeals(type?: string): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;

  // Saved trip operations
  getSavedTrips(userId: number): Promise<SavedTrip[]>;
  createSavedTrip(savedTrip: InsertSavedTrip): Promise<SavedTrip>;
  deleteSavedTrip(id: number): Promise<boolean>;

  // Recommendation operations
  getRecommendations(userId: number): Promise<Trip[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private flights: Map<number, Flight>;
  private hotels: Map<number, Hotel>;
  private activities: Map<number, Activity>;
  private deals: Map<number, Deal>;
  private savedTrips: Map<number, SavedTrip>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.flights = new Map();
    this.hotels = new Map();
    this.activities = new Map();
    this.deals = new Map();
    this.savedTrips = new Map();
    this.currentId = {
      users: 1,
      trips: 1,
      flights: 1,
      hotels: 1,
      activities: 1,
      deals: 1,
      savedTrips: 1,
    };
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample user
    const user: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      preferences: JSON.stringify({
        budget: "$1,000 - $2,500",
        style: ["Adventure & Outdoor", "Beach & Relaxation"],
        destinations: ["Europe", "Asia"],
        accommodation: "Mid-range (3★ Hotels, B&Bs)"
      })
    };
    this.users.set(1, user);
    this.currentId.users = 2;

    // Create sample flights
    const sampleFlights: Flight[] = [
      {
        id: 1,
        fromCity: "New York",
        toCity: "Paris",
        departureDate: "2024-12-15",
        returnDate: "2024-12-22",
        price: "599.00",
        originalPrice: "899.00",
        airline: "Delta Airlines",
        passengers: 1,
        class: "economy",
        discount: 30
      },
      {
        id: 2,
        fromCity: "Los Angeles",
        toCity: "Tokyo",
        departureDate: "2024-12-20",
        returnDate: "2024-12-27",
        price: "799.00",
        originalPrice: "1099.00",
        airline: "JAL",
        passengers: 1,
        class: "economy",
        discount: 25
      }
    ];
    sampleFlights.forEach(flight => this.flights.set(flight.id, flight));
    this.currentId.flights = 3;

    // Create sample hotels
    const sampleHotels: Hotel[] = [
      {
        id: 1,
        name: "Grand Hotel Rome",
        location: "Rome, Italy",
        checkIn: "2024-12-15",
        checkOut: "2024-12-22",
        price: "199.00",
        rating: "5.0",
        amenities: JSON.stringify(["WiFi", "Pool", "Spa", "Restaurant"]),
        imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
        guests: 2,
        rooms: 1
      },
      {
        id: 2,
        name: "Tokyo Palace Hotel",
        location: "Tokyo, Japan",
        checkIn: "2024-12-20",
        checkOut: "2024-12-27",
        price: "159.00",
        rating: "4.8",
        amenities: JSON.stringify(["WiFi", "Gym", "Restaurant", "Concierge"]),
        imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
        guests: 2,
        rooms: 1
      }
    ];
    sampleHotels.forEach(hotel => this.hotels.set(hotel.id, hotel));
    this.currentId.hotels = 3;

    // Create sample activities
    const sampleActivities: Activity[] = [
      {
        id: 1,
        name: "Historic Rome Walking Tour",
        location: "Rome, Italy",
        price: "89.00",
        duration: "Full day",
        type: "Cultural",
        rating: "4.9",
        description: "Explore ancient Rome with an expert guide",
        imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5"
      },
      {
        id: 2,
        name: "Mount Fuji Day Trip",
        location: "Tokyo, Japan",
        price: "120.00",
        duration: "Full day",
        type: "Adventure",
        rating: "4.7",
        description: "Experience Japan's iconic mountain",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
      }
    ];
    sampleActivities.forEach(activity => this.activities.set(activity.id, activity));
    this.currentId.activities = 3;

    // Create sample deals
    const sampleDeals: Deal[] = [
      {
        id: 1,
        type: "flights",
        title: "NYC → Paris",
        description: "Round trip • Delta Airlines",
        originalPrice: "899.00",
        currentPrice: "599.00",
        discount: 30,
        badge: "30% OFF",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
        validUntil: new Date("2024-12-31")
      },
      {
        id: 2,
        type: "hotels",
        title: "Grand Hotel Rome",
        description: "5★ • City Center",
        originalPrice: "299.00",
        currentPrice: "199.00",
        discount: 33,
        badge: "LIMITED",
        imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
        validUntil: new Date("2024-12-25")
      },
      {
        id: 3,
        type: "activities",
        title: "Historic City Tour",
        description: "Full day • Guide included",
        originalPrice: "129.00",
        currentPrice: "89.00",
        discount: 31,
        badge: "POPULAR",
        imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
        validUntil: new Date("2024-12-30")
      },
      {
        id: 4,
        type: "packages",
        title: "Maldives Package",
        description: "7 days • All inclusive",
        originalPrice: "3299.00",
        currentPrice: "2299.00",
        discount: 30,
        badge: "FLASH SALE",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        validUntil: new Date("2024-12-20")
      }
    ];
    sampleDeals.forEach(deal => this.deals.set(deal.id, deal));
    this.currentId.deals = 5;

    // Create sample trips
    const sampleTrips: Trip[] = [
      {
        id: 1,
        userId: 1,
        name: "Swiss Alps Adventure",
        destination: "Zurich, Switzerland",
        startDate: "2024-12-15",
        endDate: "2024-12-22",
        status: "upcoming",
        totalPrice: "1299.00",
        details: JSON.stringify({ 
          flights: [1], 
          hotels: [1], 
          activities: [1] 
        }),
        createdAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        name: "Thailand Explorer",
        destination: "Bangkok, Chiang Mai",
        startDate: "2024-09-05",
        endDate: "2024-09-18",
        status: "completed",
        totalPrice: "1599.00",
        details: JSON.stringify({ 
          flights: [2], 
          hotels: [2], 
          activities: [2] 
        }),
        createdAt: new Date()
      },
      {
        id: 3,
        userId: 1,
        name: "Greek Islands Getaway",
        destination: "Santorini, Mykonos",
        startDate: null,
        endDate: null,
        status: "saved",
        totalPrice: "1799.00",
        details: JSON.stringify({ 
          flights: [], 
          hotels: [], 
          activities: [] 
        }),
        createdAt: new Date()
      }
    ];
    sampleTrips.forEach(trip => this.trips.set(trip.id, trip));
    this.currentId.trips = 4;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(id: number, preferences: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.preferences = preferences;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  // Trip operations
  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async getUserTrips(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.userId === userId);
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentId.trips++;
    const trip: Trip = { 
      ...insertTrip, 
      id, 
      createdAt: new Date() 
    };
    this.trips.set(id, trip);
    return trip;
  }

  async updateTrip(id: number, updateData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (trip) {
      const updatedTrip = { ...trip, ...updateData };
      this.trips.set(id, updatedTrip);
      return updatedTrip;
    }
    return undefined;
  }

  async deleteTrip(id: number): Promise<boolean> {
    return this.trips.delete(id);
  }

  // Flight operations
  async searchFlights(search: FlightSearch): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(flight => 
      flight.fromCity.toLowerCase().includes(search.from.toLowerCase()) ||
      flight.toCity.toLowerCase().includes(search.to.toLowerCase())
    );
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = this.currentId.flights++;
    const flight: Flight = { ...insertFlight, id };
    this.flights.set(id, flight);
    return flight;
  }

  // Hotel operations
  async searchHotels(search: HotelSearch): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(hotel =>
      hotel.location.toLowerCase().includes(search.destination.toLowerCase())
    );
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.currentId.hotels++;
    const hotel: Hotel = { ...insertHotel, id };
    this.hotels.set(id, hotel);
    return hotel;
  }

  // Activity operations
  async searchActivities(search: ActivitySearch): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity =>
      activity.location.toLowerCase().includes(search.destination.toLowerCase()) &&
      (!search.type || activity.type.toLowerCase().includes(search.type.toLowerCase()))
    );
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId.activities++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Deal operations
  async getDeals(type?: string): Promise<Deal[]> {
    const allDeals = Array.from(this.deals.values());
    if (type && type !== "all") {
      return allDeals.filter(deal => deal.type === type);
    }
    return allDeals;
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.currentId.deals++;
    const deal: Deal = { ...insertDeal, id };
    this.deals.set(id, deal);
    return deal;
  }

  // Saved trip operations
  async getSavedTrips(userId: number): Promise<SavedTrip[]> {
    return Array.from(this.savedTrips.values()).filter(trip => trip.userId === userId);
  }

  async createSavedTrip(insertSavedTrip: InsertSavedTrip): Promise<SavedTrip> {
    const id = this.currentId.savedTrips++;
    const savedTrip: SavedTrip = { 
      ...insertSavedTrip, 
      id, 
      createdAt: new Date() 
    };
    this.savedTrips.set(id, savedTrip);
    return savedTrip;
  }

  async deleteSavedTrip(id: number): Promise<boolean> {
    return this.savedTrips.delete(id);
  }

  // Recommendation operations
  async getRecommendations(userId: number): Promise<Trip[]> {
    // Simple recommendation logic based on user preferences
    const user = await this.getUser(userId);
    if (!user) return [];

    const allTrips = Array.from(this.trips.values());
    return allTrips.filter(trip => trip.userId !== userId).slice(0, 6);
  }
}

export const storage = new MemStorage();
