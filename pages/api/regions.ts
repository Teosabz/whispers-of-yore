// pages/api/regions.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

const sampleRegions: Location[] = [
  { id: 1, name: "Africa", lat: 1.6508, lng: 10.2679 },
  { id: 2, name: "Asia", lat: 34.0479, lng: 100.6197 },
  { id: 3, name: "Europe", lat: 54.526, lng: 15.2551 },
  { id: 4, name: "North America", lat: 54.526, lng: -105.2551 },
  { id: 5, name: "South America", lat: -8.7832, lng: -55.4915 },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Location[]>
) {
  res.status(200).json(sampleRegions);
}
