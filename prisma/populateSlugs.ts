import { prisma } from "../lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

async function main() {
  const stories = await prisma.story.findMany();

  for (const story of stories) {
    if (!story.slug) {
      const slug = slugify(story.title);
      await prisma.story.update({
        where: { id: story.id },
        data: { slug },
      });
      console.log(`Updated slug for: ${story.title}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
