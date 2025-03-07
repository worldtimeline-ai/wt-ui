import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mapPeriods = pgTable("map_periods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  geoData: text("geo_data").notNull() // Store GeoJSON as string
});

export const insertMapPeriodSchema = createInsertSchema(mapPeriods).pick({
  name: true,
  startYear: true,
  endYear: true,
  geoData: true
});

export type InsertMapPeriod = z.infer<typeof insertMapPeriodSchema>;
export type MapPeriod = typeof mapPeriods.$inferSelect;
