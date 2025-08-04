import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // or just dotenv.config() to load .env by default

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

async function main() {
  const storiesData = [
    {
      title: "The Tortoise and the Birds",
      text: "In this African folktale, a clever tortoise tricks birds into lending him feathers so he can join them in the sky. But his greed causes his downfall.",
      region: "Africa",
      category: "Animal Tale",
      language: "English",
      approved: true,
      cover_image: "https://example.com/images/tortoise-and-birds.jpg",
      author: {
        name: "Folklore Archive",
        email: "africa@folktales.org",
      },
      tags: ["trickster", "lesson"],
      created_at: new Date().toISOString(),
    },
    {
      title: "The Crane Wife",
      text: "A Japanese folktale about a man who marries a mysterious woman who is later revealed to be a crane he once helped.",
      region: "Asia",
      category: "Romantic Tale",
      language: "English",
      approved: true,
      cover_image: "https://example.com/images/crane-wife.jpg",
      author: {
        name: "Asian Stories Vault",
        email: "asia@folktales.org",
      },
      tags: ["mythical", "sacrifice"],
      created_at: new Date().toISOString(),
    },
    {
      title: "The Bremen Town Musicians",
      text: "Four aging animals (a donkey, dog, cat, and rooster) run away to become musicians and trick robbers from their house.",
      region: "Europe",
      category: "Adventure",
      language: "English",
      approved: true,
      cover_image: "https://example.com/images/bremen-town-musicians.jpg",
      author: {
        name: "European Folk Repository",
        email: "europe@folktales.org",
      },
      tags: ["teamwork", "cleverness"],
      created_at: new Date().toISOString(),
    },
  ];

  for (const story of storiesData) {
    const slug = slugify(story.title);

    // 1. Upsert author
    const { data: existingAuthor, error: authorError } = await supabase
      .from("users")
      .select("id")
      .eq("email", story.author.email)
      .maybeSingle();

    if (authorError) {
      console.error("Error checking author:", authorError);
      continue;
    }

    let authorId = existingAuthor?.id;

    if (!authorId) {
      const { data: newAuthor, error: insertAuthorError } = await supabase
        .from("users")
        .insert({
          name: story.author.name,
          email: story.author.email,
        })
        .select("id")
        .single();

      if (insertAuthorError) {
        console.error("Error inserting author:", insertAuthorError);
        continue;
      }
      authorId = newAuthor?.id;
    }

    if (!authorId) {
      console.error("Author ID not found, skipping story:", story.title);
      continue;
    }

    // 2. Insert story
    const { data: insertedStory, error: storyError } = await supabase
      .from("stories")
      .insert({
        title: story.title,
        slug,
        text: story.text,
        region: story.region,
        category: story.category,
        language: story.language,
        approved: story.approved,
        cover_image: story.cover_image,
        created_at: story.created_at,
        author_id: authorId,
      })
      .select("id")
      .single();

    if (storyError) {
      console.error("Error inserting story:", storyError);
      continue;
    }

    const storyId = insertedStory?.id;
    if (!storyId) {
      console.error("Story ID not returned for:", story.title);
      continue;
    }

    // 3. Upsert tags & link to story
    for (const tagName of story.tags) {
      // Check if tag exists
      const { data: existingTag, error: tagError } = await supabase
        .from("tags")
        .select("id")
        .eq("name", tagName)
        .maybeSingle();

      if (tagError) {
        console.error("Error checking tag:", tagError);
        continue;
      }

      let tagId = existingTag?.id;

      if (!tagId) {
        // Insert new tag
        const { data: newTag, error: insertTagError } = await supabase
          .from("tags")
          .insert({ name: tagName })
          .select("id")
          .single();

        if (insertTagError) {
          console.error("Error inserting tag:", insertTagError);
          continue;
        }

        tagId = newTag?.id;
      }

      if (!tagId) {
        console.error("Tag ID not found for:", tagName);
        continue;
      }

      // Link story & tag in join table (story_tags)
      const { error: linkError } = await supabase
        .from("story_tags")
        .upsert(
          { story_id: storyId, tag_id: tagId },
          { onConflict: "story_id,tag_id" }
        );

      if (linkError) {
        console.error("Error linking tag to story:", linkError);
      }
    }

    console.log(`Inserted story: ${story.title}`);
  }

  console.log("✅ All stories seeded.");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
