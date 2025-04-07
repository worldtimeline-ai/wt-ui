'use client';

import { useState, useRef, useEffect } from "react";
import type { MapState } from "@/src/types";
import YearRangeSelector from "./YearRangeSelector";
import WTGoogleMap from "./WTGoogleMap";
import { getEvents } from "../lib/api/event.service";
import SidePanel from "./SidePanel";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [events, setEvents] = useState<any>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [startingUp, setStartingUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mapState, setMapState] = useState<MapState>({
    year: {
      start: 2015,
      end: 2025
    },
    view: {
      center: { lat: 51.5072, lng: 0.1276 },
      zoom: 7
    }
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setStartingUp(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapState((prevState: MapState) => ({
          ...prevState,
          view: {
            ...prevState.view,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        }));
        setStartingUp(false);
      },
      (err) => {
        setStartingUp(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!isLoading && !startingUp) {
      setIsLoading(true);
      getEvents(mapState).then(data => {
        setEvents(data.events);
        setTags([...(new Set(data.events.flatMap((ev: any) => ev.tags)))].map((t) => ({ name: t, selected: true })));
        setIsLoading(false);
      });
    }
  }, [mapState, startingUp]);

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
      <WTGoogleMap mapState={mapState} setMapState={setMapState} events={events} tags={tags} />
      <SidePanel events={events} setEvents={setEvents} tags={tags} setTags={setTags} />
      <YearRangeSelector isLoading={isLoading} mapState={mapState} setMapState={setMapState} />
    </main>
  );
}
