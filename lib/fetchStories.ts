// lib/fetchStories.ts

import { supabase } from "./supabaseClient";
import type { Story } from "../types/models";

type SupabaseRawStory = {
  id: number;
  title: string;
  slug: string;
  text: string;
  region: string;
  category: string;
  language: string;
  cover_image: string | null;
  approved: boolean;
  created_at: string;
  author: { id: number; name: string }[]; // Supabase returns array for single relation
  story_tag: { tags: { id: number; name: string } }[];
};

export async function fetchStories(): Promise<Story[]> {
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
      approved,
      created_at,
      author:users(id, name),
      story_tag (
        tags(id, name)
      )
    `
    )
    .eq("approved", true);

  if (error) throw error;

  const rawStories = data as unknown as SupabaseRawStory[];

  return rawStories.map((story) => ({
    id: story.id,
    title: story.title,
    slug: story.slug,
    text: story.text,
    region: story.region,
    category: story.category,
    language: story.language,
    cover_image: story.cover_image,
    approved: story.approved,
    created_at: story.created_at,
    author: story.author.length > 0 ? story.author[0] : null,
    tags: story.story_tag.map((st) => st.tags),
  }));
}
