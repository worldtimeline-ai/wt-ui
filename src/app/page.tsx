'use client';

import { useState, useRef, useEffect, AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import type { MapState } from "@/src/types";
import YearRangeSelector from "../components/YearRangeSelector";
import WTGoogleMap from "../components/WTGoogleMap";
import { getEvents } from "../lib/api/event.service";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [events, setEvents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      getEvents(mapState).then(data => {
        setEvents(data.events);
        setIsLoading(false);
      });
    }
  }, [mapState]);

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
      <WTGoogleMap mapState={mapState} setMapState={setMapState} events={events} />
      <div tabIndex={0} className="collapse fixed left-10 top-20 w-1/4">
        <div className="text-blue-500 underline cursor-pointer text-xs pl-[1rem]">
          <div className="bg-blue-500 text-white rounded-lg p-2 w-14 flex items-center justify-center">Events</div>
        </div>
        <div className="collapse-content text-black">
          <div className="h-96 overflow-y-auto flex flex-col gap-1 bg-white rounded-lg">
            {events.map((ev: any) => (
              <div className="border-b-1 p-4 cursor-pointer">
                <p className="text-[12px]">{ev.description}</p>
                <div className="flex gap-1">
                  <div className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{ev.year}</div>
                  {ev.tags.map((tag: string) => (
                    <div key={tag} className="text-[8px] py-1 px-2 rounded-full bg-gray-300">{tag}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <YearRangeSelector isLoading={isLoading} mapState={mapState} setMapState={setMapState} />
    </main>
  );
}
