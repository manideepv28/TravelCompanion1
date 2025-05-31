import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  flightSearchSchema, 
  hotelSearchSchema, 
  activitySearchSchema,
  insertTripSchema,
  insertSavedTripSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.put("/api/user/:id/preferences", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { preferences } = req.body;
      const user = await storage.updateUserPreferences(id, JSON.stringify(preferences));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Flight routes
  app.post("/api/flights/search", async (req, res) => {
    try {
      const searchData = flightSearchSchema.parse(req.body);
      const flights = await storage.searchFlights(searchData);
      res.json(flights);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flight = await storage.getFlight(id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flight" });
    }
  });

  // Hotel routes
  app.post("/api/hotels/search", async (req, res) => {
    try {
      const searchData = hotelSearchSchema.parse(req.body);
      const hotels = await storage.searchHotels(searchData);
      res.json(hotels);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to get hotel" });
    }
  });

  // Activity routes
  app.post("/api/activities/search", async (req, res) => {
    try {
      const searchData = activitySearchSchema.parse(req.body);
      const activities = await storage.searchActivities(searchData);
      res.json(activities);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activity" });
    }
  });

  // Deal routes
  app.get("/api/deals", async (req, res) => {
    try {
      const type = req.query.type as string;
      const deals = await storage.getDeals(type);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to get deal" });
    }
  });

  // Trip routes
  app.get("/api/trips/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trips = await storage.getUserTrips(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trips" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid trip data" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const trip = await storage.updateTrip(id, updateData);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrip(id);
      if (!success) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Saved trips routes
  app.get("/api/saved-trips/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const savedTrips = await storage.getSavedTrips(userId);
      res.json(savedTrips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get saved trips" });
    }
  });

  app.post("/api/saved-trips", async (req, res) => {
    try {
      const savedTripData = insertSavedTripSchema.parse(req.body);
      const savedTrip = await storage.createSavedTrip(savedTripData);
      res.status(201).json(savedTrip);
    } catch (error) {
      res.status(400).json({ message: "Invalid saved trip data" });
    }
  });

  app.delete("/api/saved-trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSavedTrip(id);
      if (!success) {
        return res.status(404).json({ message: "Saved trip not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete saved trip" });
    }
  });

  // Recommendations route
  app.get("/api/recommendations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
