import { mapPeriods, type MapPeriod, type InsertMapPeriod } from "@shared/schema";

export interface IStorage {
  getMapPeriods(): Promise<MapPeriod[]>;
  getMapPeriodForYear(year: number): Promise<MapPeriod | undefined>;
}

export class MemStorage implements IStorage {
  private mapPeriods: MapPeriod[];

  constructor() {
    this.mapPeriods = [
      {
        id: 1,
        name: "Present Day",
        startYear: 0,
        endYear: 2024,
        geoData: JSON.stringify({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [[
                  [-60, 30],
                  [60, 30],
                  [60, -30],
                  [-60, -30],
                  [-60, 30]
                ]],
                [[
                  [-120, 60],
                  [-60, 60],
                  [-60, 20],
                  [-120, 20],
                  [-120, 60]
                ]],
                [[
                  [60, 60],
                  [120, 60],
                  [120, 20],
                  [60, 20],
                  [60, 60]
                ]]
              ]
            },
            properties: {
              name: "Continents"
            }
          }]
        })
      },
      {
        id: 2,
        name: "Last Ice Age",
        startYear: -20000,
        endYear: -10000,
        geoData: JSON.stringify({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [[
                  [-60, 60],
                  [60, 60],
                  [60, -30],
                  [-60, -30],
                  [-60, 60]
                ]],
                [[
                  [-120, 85],
                  [-60, 85],
                  [-60, 40],
                  [-120, 40],
                  [-120, 85]
                ]],
                [[
                  [60, 85],
                  [120, 85],
                  [120, 40],
                  [60, 40],
                  [60, 85]
                ]]
              ]
            },
            properties: {
              name: "Ice Age Continents"
            }
          }]
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