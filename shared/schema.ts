import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  preferences: text("preferences"), // JSON string for user preferences
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").notNull(), // upcoming, completed, saved
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  details: text("details"), // JSON string for trip details
  createdAt: timestamp("created_at").defaultNow(),
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  airline: text("airline").notNull(),
  passengers: integer("passengers").default(1),
  class: text("class").default("economy"),
  discount: integer("discount").default(0),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  amenities: text("amenities"), // JSON array
  imageUrl: text("image_url"),
  guests: integer("guests").default(1),
  rooms: integer("rooms").default(1),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // flights, hotels, activities, packages
  title: text("title").notNull(),
  description: text("description"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  discount: integer("discount").notNull(),
  badge: text("badge"), // "30% OFF", "LIMITED", "POPULAR", "FLASH SALE"
  imageUrl: text("image_url"),
  validUntil: timestamp("valid_until"),
});

export const savedTrips = pgTable("saved_trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tripId: integer("trip_id"),
  flightId: integer("flight_id"),
  hotelId: integer("hotel_id"),
  activityIds: text("activity_ids"), // JSON array of activity IDs
  customName: text("custom_name"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTripSchema = createInsertSchema(trips).omit({ id: true, createdAt: true });
export const insertFlightSchema = createInsertSchema(flights).omit({ id: true });
export const insertHotelSchema = createInsertSchema(hotels).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true });
export const insertSavedTripSchema = createInsertSchema(savedTrips).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type SavedTrip = typeof savedTrips.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type InsertSavedTrip = z.infer<typeof insertSavedTripSchema>;

// Search schemas
export const flightSearchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  departureDate: z.string().min(1),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).default(1),
  class: z.enum(["economy", "business", "first"]).default("economy"),
});

export const hotelSearchSchema = z.object({
  destination: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().min(1).default(1),
  rooms: z.number().min(1).default(1),
});

export const activitySearchSchema = z.object({
  destination: z.string().min(1),
  type: z.string().optional(),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export type FlightSearch = z.infer<typeof flightSearchSchema>;
export type HotelSearch = z.infer<typeof hotelSearchSchema>;
export type ActivitySearch = z.infer<typeof activitySearchSchema>;
