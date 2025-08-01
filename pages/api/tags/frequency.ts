// pages/api/tags/frequency.ts

import type { NextApiRequest, NextApiResponse } from "next";

type TagFrequency = {
  tag: string;
  count: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagFrequency[]>
) {
  if (req.method === "GET") {
    const sampleTags = [
      { tag: "myth", count: 12 },
      { tag: "legend", count: 7 },
      { tag: "animal", count: 4 },
    ];
    res.status(200).json(sampleTags);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
