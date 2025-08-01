import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const tagsWithCounts = await prisma.tag.findMany({
      include: {
        stories: {
          select: { id: true },
        },
      },
    });

    const result = tagsWithCounts.map((tag) => ({
      name: tag.name,
      count: tag.stories.length,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Failed to load tag frequency:", err);
    return res.status(500).json({ error: "Failed to fetch tag data." });
  }
}
