// scripts/seed.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function upsertAuthor(author: { name: string; email: string }) {
  const { data, error } = await supabase
    .from("users")
    .upsert(author, { onConflict: "email" })
    .select("id")
    .single();

  if (error) {
    console.error("Error upserting author:", error);
    return null;
  }
  return data?.id;
}

async function upsertTag(name: string) {
  const { data, error } = await supabase
    .from("tags")
    .upsert({ name }, { onConflict: "name" })
    .select("id")
    .single();

  if (error) {
    console.error("Error upserting tag:", error);
    return null;
  }
  return data?.id;
}

async function main() {
  // 1. Authors
  const authors = [
    { name: "Kofi Agyeman", email: "kofi@example.com" },
    { name: "Mei Ling", email: "mei@example.com" },
    { name: "Luka Petrović", email: "luka@example.com" },
  ];

  const authorIds: Record<string, number> = {};
  for (const author of authors) {
    const id = await upsertAuthor(author);
    if (id) {
      authorIds[author.email] = id;
    }
  }

  // 2. Stories
  const stories = [
    {
      title: "The Clever Hare",
      slug: "the-clever-hare",
      text: "A clever hare once outwitted a lion...",
      region: "Africa",
      category: "Trickster",
      language: "Swahili",
      author_email: "kofi@example.com",
      cover_image:
        "https://images.unsplash.com/photo-1603052875223-4ce9727de00f",
    },
    {
      title: "The Jade Rabbit",
      slug: "the-jade-rabbit",
      text: "The Jade Rabbit lived on the moon...",
      region: "Asia",
      category: "Mythical",
      language: "Mandarin",
      author_email: "mei@example.com",
      cover_image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed7",
    },
    {
      title: "The Brave Shepherd",
      slug: "the-brave-shepherd",
      text: "A young shepherd once saved his village...",
      region: "Europe",
      category: "Heroic",
      language: "Serbian",
      author_email: "luka@example.com",
      cover_image:
        "https://images.unsplash.com/photo-1588392382834-a891154bca4d",
    },
  ];

  // Insert stories & collect their IDs
  const storyIds: Record<string, number> = {};
  for (const story of stories) {
    const authorId = authorIds[story.author_email];
    if (!authorId) {
      console.error("Author ID not found for story:", story.title);
      continue;
    }

    const { data, error } = await supabase
      .from("stories")
      .upsert(
        {
          title: story.title,
          slug: story.slug,
          text: story.text,
          region: story.region,
          category: story.category,
          language: story.language,
          author_id: authorId,
          cover_image: story.cover_image,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("Story Insert Error:", error);
      continue;
    }

    if (data?.id) {
      storyIds[story.slug] = data.id;
      console.log(`Inserted/updated story: ${story.title}`);
    }
  }

  // 3. Tags
  const tags = [
    "trickster",
    "lesson",
    "mythical",
    "heroic",
    "courage",
    "cleverness",
  ];

  const tagIds: Record<string, number> = {};
  for (const tag of tags) {
    const id = await upsertTag(tag);
    if (id) {
      tagIds[tag] = id;
    }
  }

  // 4. Link stories & tags (story_tags join table)
  const storyTags = [
    { storySlug: "the-clever-hare", tagName: "trickster" },
    { storySlug: "the-clever-hare", tagName: "cleverness" },
    { storySlug: "the-jade-rabbit", tagName: "mythical" },
    { storySlug: "the-brave-shepherd", tagName: "heroic" },
    { storySlug: "the-brave-shepherd", tagName: "courage" },
  ];

  for (const link of storyTags) {
    const story_id = storyIds[link.storySlug];
    const tag_id = tagIds[link.tagName];

    if (!story_id || !tag_id) {
      console.error("Missing story or tag ID for:", link);
      continue;
    }

    const { error } = await supabase
      .from("story_tag")
      .upsert([{ story_id, tag_id }], { onConflict: "story_id,tag_id" });

    if (error) {
      console.error("Error linking story and tag:", error);
    }
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
