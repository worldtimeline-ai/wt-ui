'use client';

import { useState, useRef, useEffect } from "react";
import type { MapState } from "@/src/types";
import YearRangeSelector from "../components/YearRangeSelector";
import WTGoogleMap from "../components/WTGoogleMap";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [mapState, setMapState] = useState<MapState>({
    year: {
      start: 2015,
      end: 2025
    },
    view: {
      center: { lat: 28.6139, lng: 77.2090 },
      zoom: 7
    }
  });

  console.log(mapState);

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (mainRef.current) {
        event.preventDefault();
      }
    };
    document.body.style.overflow = "hidden";
    mainRef.current?.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      document.body.style.overflow = "";
      mainRef.current?.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <main ref={mainRef} className="relative h-screen w-screen overscroll-none">
      <WTGoogleMap mapState={mapState} setMapState={setMapState} />
      <YearRangeSelector mapState={mapState} setMapState={setMapState} />
    </main>
  );
}
