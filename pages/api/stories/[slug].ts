// pages/api/stories/[slug].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid story slug" });
  }

  try {
    const { data, error } = await supabase
      .from("stories")
      .select(
        `
        id,
        title,
        slug,
        text,
        region,
        category,
        language,
        approved,
        created_at,
        cover_image,
        source_url,
        author:users(id, name),
        tags:story_tag(tag_id, tags(name, id))
      `
      )
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Transform tags array
    const tags =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.tags?.map((t: any) => ({
        id: t.tags?.id,
        name: t.tags?.name,
      })) ?? [];

    const story = {
      ...data,
      tags,
    };

    return res.status(200).json(story);
  } catch (error) {
    console.error("Failed to fetch story:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
