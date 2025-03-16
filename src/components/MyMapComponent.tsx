"use client";

import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function MyMapComponent(props) {
  const { mapState, setMapState } = props;
  const map = useMap();

  useEffect(() => {
    const updateMapInfo = () => {
      setMapState({
        ...mapState,
        view: {
          zoom: map.getZoom(),
          center: map.getCenter(),
        }
      });
    };

    map.on("loaded", updateMapInfo);
    map.on("moveend", updateMapInfo);
    map.on("zoomend", updateMapInfo);

    return () => {
      map.off("loaded", updateMapInfo);
      map.off("moveend", updateMapInfo);
      map.off("zoomend", updateMapInfo);
    };
  }, [map]);

  console.log(mapState);

  return (
    <div className="">
      hello
    </div>
  );
}
