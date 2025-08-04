import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";
import { ApiResponse } from "../../types/api-response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[]>>
) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        // Remove orderBy or comment it out since createdAt doesn't exist
        // orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ success: true, data: users });
    } catch (err) {
      console.error("Error fetching users:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch users." });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res
          .status(400)
          .json({ success: false, error: "Name and email are required." });
      }

      const user = await prisma.user.create({ data: { name, email } });
      return res.status(201).json({ success: true, data: [user] });
    } catch (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to create user." });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed." });
}
