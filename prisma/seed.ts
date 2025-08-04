import fetch from "node-fetch"; // npm install node-fetch@2
import { supabase } from "../lib/supabase"; // your Supabase client instance
import { prisma } from "../lib/prisma";

const topics = ["folktale", "forest", "tribal", "myth", "legend"];

function getRandomCoverImageUrl() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return `https://source.unsplash.com/random/800x600/?${topic}`;
}

async function downloadAndUploadImage(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);

  const buffer = await response.buffer();

  const { error: uploadError } = await supabase.storage
    .from("story-covers")
    .upload(filename, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: response.headers.get("content-type") || undefined,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("story-covers").getPublicUrl(filename);

  if (!data?.publicUrl) throw new Error("Failed to get public URL");

  return data.publicUrl;
}

async function main() {
  const stories = [
    {
      title: "The Hare and the Lion",
      text: "Once upon a time, in a golden savanna, a clever hare outwitted a mighty lion...",
      region: "Africa",
      category: "Folktale",
      language: "English",
      tags: ["Animals", "Trickery"],
      author: {
        name: "Aesop",
        email: "aesop@folktales.org",
      },
    },
    {
      title: "Momotaro: The Peach Boy",
      text: "An old couple found a giant peach floating down the river. When they cut it open, a boy emerged—Momotaro, who grew up brave and kind. One day, he set off to defeat demons and help the weak.",
      region: "Asia",
      category: "Hero Tales",
      language: "English",
      tags: ["Bravery", "Adventure"],
      author: {
        name: "Japanese Folklore",
        email: "japan@folktales.org",
      },
    },
    // Add more stories as needed
  ];

  for (const story of stories) {
    const randomUrl = getRandomCoverImageUrl();
    // Supabase storage paths should NOT start with a slash
    // Replace spaces with underscores to create safe filenames
    const filename = `story-covers/${story.title.replace(/\s+/g, "_")}.jpg`;

    console.log(`Downloading & uploading image for: ${story.title}`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const coverImageUrl = await downloadAndUploadImage(randomUrl, filename);

      await prisma.story.create({
        data: {
          slug: "some-unique-slug", // must provide this
          title: "My Story Title",
          text: "Story text...",
          region: "Africa",
          category: "Folk",
          language: "English",
          approved: true,
          coverImage: "url-or-null",
          author: {
            connectOrCreate: {
              where: { email: "author@example.com" },
              create: { name: "Author Name", email: "author@example.com" },
            },
          },
          tags: {
            connectOrCreate: [
              { where: { name: "tag1" }, create: { name: "tag1" } },
              { where: { name: "tag2" }, create: { name: "tag2" } },
            ],
          },
        },
      });

      console.log(`✅ Seeded story: ${story.title}`);
    } catch (err) {
      console.error(`❌ Failed for story ${story.title}:`, err);
    }
  }

  await prisma.$disconnect();
}

main();
