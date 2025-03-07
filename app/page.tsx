'use client';

import { useState, useCallback } from "react";
import MapVisualization from "@/components/MapVisualization";
import TimeControls from "@/components/TimeControls";
import type { MapState, TimeRange, ViewState } from "@/types";

export default function Home() {
  const [mapState, setMapState] = useState<MapState>({
    timeRange: {
      start: 1900,
      end: 2024
    },
    view: {
      center: [0, 20],
      zoom: 1
    },
    isTimeScroll: false
  });

  const handleTimeChange = useCallback((timeRange: TimeRange) => {
    setMapState(prev => ({ ...prev, timeRange }));
  }, []);

  const handleViewChange = useCallback((view: ViewState) => {
    setMapState(prev => ({ ...prev, view }));
  }, []);

  const handleToggleTimeScroll = useCallback((enabled: boolean) => {
    setMapState(prev => ({ ...prev, isTimeScroll: enabled }));
  }, []);

  const handleScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (!mapState.isTimeScroll) return;

    event.preventDefault();
    const timeSpan = mapState.timeRange.end - mapState.timeRange.start;
    const shift = event.deltaY * timeSpan * 0.001;

    setMapState(prev => ({
      ...prev,
      timeRange: {
        start: prev.timeRange.start + shift,
        end: prev.timeRange.end + shift
      }
    }));
  }, [mapState.isTimeScroll, mapState.timeRange]);

  return (
    <main className="container mx-auto py-8 space-y-4">
      <h1 className="text-4xl font-bold mb-8">Historical World Map</h1>

      <TimeControls
        timeRange={mapState.timeRange}
        isTimeScroll={mapState.isTimeScroll}
        onTimeChange={handleTimeChange}
        onToggleTimeScroll={handleToggleTimeScroll}
      />

      <div onWheel={handleScroll}>
        <MapVisualization
          year={Math.floor((mapState.timeRange.start + mapState.timeRange.end) / 2)}
          view={mapState.view}
          onViewChange={handleViewChange}
        />
      </div>
    </main>
  );
}
