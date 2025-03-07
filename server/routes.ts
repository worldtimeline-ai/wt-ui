import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/map-periods", async (_req, res) => {
    try {
      const periods = await storage.getMapPeriods();
      res.json(periods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch map periods" });
    }
  });

  app.get("/api/map-period/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const period = await storage.getMapPeriodForYear(year);
      
      if (!period) {
        return res.status(404).json({ message: "No map data for specified year" });
      }
      
      res.json(period);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch map data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
