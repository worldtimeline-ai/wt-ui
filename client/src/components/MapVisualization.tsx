import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MapPeriod } from "@shared/schema";
import type { ViewState } from "@shared/types";

interface Props {
  year: number;
  view: ViewState;
  onViewChange: (view: ViewState) => void;
}

export default function MapVisualization({ year, view, onViewChange }: Props) {
  const { data: mapData, isLoading, error } = useQuery<MapPeriod>({
    queryKey: [`/api/map-period/${year}`],
  });

  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newZoom = view.zoom - event.deltaY * 0.001;
    onViewChange({
      ...view,
      zoom: Math.max(1, Math.min(8, newZoom))
    });
  };

  if (isLoading) {
    return <div className="w-full h-[600px] animate-pulse bg-gray-200" />;
  }

  if (error) {
    console.error("Map data error:", error);
    return <div className="w-full h-[600px] flex items-center justify-center text-red-500">
      Error loading map data
    </div>;
  }

  if (!mapData) {
    return <div className="w-full h-[600px] flex items-center justify-center text-gray-500">
      No map data available for year {year}
    </div>;
  }

  let geoData;
  try {
    geoData = JSON.parse(mapData.geoData);
  } catch (e) {
    console.error("Failed to parse map data:", e);
    return <div className="w-full h-[600px] flex items-center justify-center text-red-500">
      Invalid map data format
    </div>;
  }

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden"
         onWheel={handleZoom}>
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 100 * view.zoom,
          center: view.center
        }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F53" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}