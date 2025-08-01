import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const pendingStories = await prisma.story.findMany({
        where: { approved: false },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(pendingStories);
    } catch (error) {
      console.error("Error fetching pending stories:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch pending stories." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
