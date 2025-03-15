"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";

// Fix the default marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "/leaflet/marker-icon-blue.png", // Place a marker icon in the public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MyMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures map renders only on client side
  }, []);

  if (!mounted) return <p>Loading map...</p>;

  return (
    <div className="absolute inset-0 p-0">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={10}
        style={{ marginTop: 76, height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[28.6139, 77.2090]} icon={icon}>
          <Popup>Delhi, India</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
