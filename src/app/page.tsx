'use client';

import { useState, useCallback } from "react";
import dynamic from "next/dynamic"
import TimeControls from "@/src/components/TimeControls";
import type { MapState, TimeRange, ViewState } from "@/src/types";

const MyMap = dynamic(() => import("@/src/components/MyMap"), { ssr: false })

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
    <main className="relative h-screen w-screen">
      {/* <h1 className="text-4xl font-bold mb-8">Historical World Map</h1> */}

      {/* <div onWheel={handleScroll}> */}
      <MyMap mapState={mapState} setMapState={setMapState}
          // view={mapState.view}
          // onViewChange={handleViewChange}
        />
      {/* </div> */}

      <TimeControls
        timeRange={mapState.timeRange}
        isTimeScroll={mapState.isTimeScroll}
        onTimeChange={handleTimeChange}
        onToggleTimeScroll={handleToggleTimeScroll}
      />
    </main>
  );
}
