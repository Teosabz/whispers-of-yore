// pages/api/stories/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import type { Story } from "../../types/models";

type SupabaseRawStory = {
  id: number;
  title: string;
  slug: string;
  text: string;
  region: string;
  category: string;
  language: string;
  cover_image: string | null;
  source_url: string | null;
  approved: boolean;
  created_at: string;
  users: { id: number; name: string }[];
  story_tag: { tags: { id: number; name: string } }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Story[] | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
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
        cover_image,
        source_url,
        approved,
        created_at,
        users(id, name),
        story_tag (
          tags(id, name)
        )
      `
      )
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch stories" });
    }

    const rawStories = data as unknown as SupabaseRawStory[];

    const stories: Story[] = rawStories.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      text: story.text,
      region: story.region,
      category: story.category,
      language: story.language,
      cover_image: story.cover_image,
      source_url: story.source_url,
      approved: story.approved,
      created_at: story.created_at,
      author: story.users.length > 0 ? story.users[0] : null,
      tags: story.story_tag.map((st) => st.tags),
    }));

    return res.status(200).json(stories);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
