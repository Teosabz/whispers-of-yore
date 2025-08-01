"use client";

import dynamic from "next/dynamic";

// Dynamically import the map client component to disable SSR
const RegionMapClient = dynamic(() => import("./RegionMapClient"), {
  ssr: false,
  loading: () => <p className="text-yellow-700">Loading map...</p>,
});

export default function RegionMap() {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-2xl shadow-lg border border-yellow-300 bg-white">
      <RegionMapClient />
    </div>
  );
}
