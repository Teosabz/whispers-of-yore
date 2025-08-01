import fs from "fs";
import { supabase } from "../lib/supabase";

const DEFAULT_AUTHOR_ID = 1; // 👈 Change this to match your real Supabase user ID

function sanitizeText(text: string, maxWords = 1000): string {
  return text.split(" ").slice(0, maxWords).join(" ");
}

function getRandomCoverImage(): string {
  return `https://source.unsplash.com/random/800x600/?folktale,story,art`;
}

async function uploadFolktales() {
  const rawData = fs.readFileSync("./data/folktales.json", "utf-8");
  const data = JSON.parse(rawData);

  for (const item of data) {
    const title = item.title?.trim() || "Untitled Story";
    const text = sanitizeText(item.text || "", 1000);
    const region = item.region?.trim() || "Unknown";
    const category = item.category?.trim() || "Folktale";
    const language = item.language?.trim() || "English";
    const sourceUrl = item.sourceUrl || null;
    const coverImage = item.coverImage || getRandomCoverImage();

    const { error } = await supabase.from("stories").insert({
      title,
      text,
      region,
      category,
      language,
      source_url: sourceUrl,
      cover_image: coverImage,
      approved: true,
      author_id: DEFAULT_AUTHOR_ID,
    });

    if (error) {
      console.error("❌ Failed:", title, error.message);
    } else {
      console.log("✅ Uploaded:", title);
    }
  }
}

uploadFolktales();
