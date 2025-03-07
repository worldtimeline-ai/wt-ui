import { mapPeriods, type MapPeriod, type InsertMapPeriod } from "@shared/schema";

export interface IStorage {
  getMapPeriods(): Promise<MapPeriod[]>;
  getMapPeriodForYear(year: number): Promise<MapPeriod | undefined>;
}

export class MemStorage implements IStorage {
  private mapPeriods: MapPeriod[];

  constructor() {
    // Initialize with some basic historical periods
    this.mapPeriods = [
      {
        id: 1,
        name: "Present Day",
        startYear: 0,
        endYear: 2024,
        geoData: JSON.stringify({
          type: "FeatureCollection",
          features: [] // Modern world map GeoJSON
        })
      },
      {
        id: 2,
        name: "Last Ice Age",
        startYear: -20000,
        endYear: -10000,
        geoData: JSON.stringify({
          type: "FeatureCollection",
          features: [] // Ice age map GeoJSON
        })
      }
    ];
  }

  async getMapPeriods(): Promise<MapPeriod[]> {
    return this.mapPeriods;
  }

  async getMapPeriodForYear(year: number): Promise<MapPeriod | undefined> {
    return this.mapPeriods.find(
      period => year >= period.startYear && year <= period.endYear
    );
  }
}

export const storage = new MemStorage();
