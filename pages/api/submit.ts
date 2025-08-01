import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { title, region, category, contributor, tags, text } = req.body;

  if (!title || !region || !category || !text) {
    return res.status(400).json({
      error: "Missing required fields: title, region, category, or text",
    });
  }

  const newStory = {
    title,
    region,
    category,
    contributor: contributor || "Anonymous",
    tags: tags
      ?.split(",")
      .map((t: string) => t.trim())
      .filter(Boolean),
    text,
    createdAt: new Date().toISOString(),
  };

  console.log("📝 New story submitted:", newStory);

  // TODO: Save to database or file later

  return res.status(200).json({ success: true });
}
