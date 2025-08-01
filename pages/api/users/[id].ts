import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { User } from "@prisma/client";
import { ApiResponse } from "../../../../types/api-response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  const { id } = req.query;
  const userId = parseInt(id as string);

  if (isNaN(userId)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          contributions: {
            where: { approved: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch user." });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed." });
}
