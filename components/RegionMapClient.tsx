"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon URLs for Next.js environment
const DefaultIcon = L.Icon.Default.extend({
  options: {
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  },
});
L.Marker.prototype.options.icon = new DefaultIcon();

// Red icon for selected marker
const selectedIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-red.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Region = {
  id: string;
  name: string;
  position: [number, number];
  description?: string;
};

const regions: Region[] = [
  { id: "africa", name: "Africa", position: [1.2921, 36.8219] },
  { id: "asia", name: "Asia", position: [34.0479, 100.6197] },
  { id: "europe", name: "Europe", position: [48.8566, 2.3522] },
];

// Helper component to pan/zoom map on selected region
function MapPanTo({ position }: { position: [number, number] | null }) {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 5, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
}

export default function RegionMapClient() {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(
    null
  );

  const center: [number, number] = [20, 0];
  const zoom = 2;

  const handleMarkerClick = (id: string) => {
    setSelectedRegion(id);
  };

  const selectedPosition = selectedRegion
    ? regions.find((r) => r.id === selectedRegion)?.position || null
    : null;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {regions.map((region) => (
        <Marker
          key={region.id}
          position={region.position}
          icon={selectedRegion === region.id ? selectedIcon : new DefaultIcon()}
          eventHandlers={{ click: () => handleMarkerClick(region.id) }}
        >
          <Popup>
            <strong>{region.name}</strong>
            <br />
            {region.description || "Folktales from this region."}
          </Popup>
        </Marker>
      ))}
      <MapPanTo position={selectedPosition} />
    </MapContainer>
  );
}
