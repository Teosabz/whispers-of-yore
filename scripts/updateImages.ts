// scripts/updateImages.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function updateImages() {
  // Fetch stories from Supabase
  const { data: stories, error } = await supabase
    .from("stories")
    .select("id, title");

  if (error) {
    console.error("❌ Error fetching stories:", error);
    return;
  }

  if (!stories || stories.length === 0) {
    console.log("ℹ️ No stories found.");
    return;
  }

  for (const story of stories) {
    // Generate Unsplash image URL using the story title and keyword
    const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(
      story.title
    )},folktale`;

    // Update the story with the generated image URL
    const { error: updateError } = await supabase
      .from("stories")
      .update({ image_url: imageUrl })
      .eq("id", story.id);

    if (updateError) {
      console.error(`❌ Failed to update "${story.title}":`, updateError);
    } else {
      console.log(`✅ Updated image for: ${story.title}`);
    }
  }

  console.log("🎉 All stories updated with image URLs.");
}

// Run the script
updateImages();
