"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Default icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Highlighted icon for selected region
const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type Region = {
  name: string;
  coordinates: [number, number];
};

interface RegionMapProps {
  selectedRegion: string;
  onRegionClick: (region: string) => void;
  availableRegions: Region[];
}

// Component to handle smooth panning when region changes
const MapUpdater = ({
  selectedRegion,
  availableRegions,
}: {
  selectedRegion: string;
  availableRegions: Region[];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedRegion) return;

    const region = availableRegions.find((r) => r.name === selectedRegion);
    if (region) {
      map.flyTo(region.coordinates, 5, { duration: 1.5 });
    }
  }, [selectedRegion, availableRegions, map]);

  // Ensure map correctly calculates size after mount and on window resize
  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    map.invalidateSize();
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
};

export default function RegionMap({
  selectedRegion,
  onRegionClick,
  availableRegions,
}: RegionMapProps) {
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;

  return (
    <div className="w-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false} // prevent zoom on scroll
        style={{
          width: "100%",
          height: "50vh", // responsive height based on viewport
          minHeight: "300px",
          maxHeight: "600px",
        }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapUpdater
          selectedRegion={selectedRegion}
          availableRegions={availableRegions}
        />

        {availableRegions.map((region) => (
          <Marker
            key={region.name}
            position={region.coordinates}
            icon={region.name === selectedRegion ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onRegionClick(region.name),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              {region.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
