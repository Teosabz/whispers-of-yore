import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const storiesData = [
    {
      title: "The Tortoise and the Birds",
      text: "In this African folktale, a clever tortoise tricks birds into lending him feathers so he can join them in the sky. But his greed causes his downfall.",
      region: "Africa",
      category: "Animal Tale",
      language: "English",
      approved: true,
      coverImage: "https://example.com/images/tortoise-and-birds.jpg",
      author: {
        create: {
          name: "Folklore Archive",
          email: "africa@folktales.org",
        },
      },
      tags: {
        create: [{ name: "trickster" }, { name: "lesson" }],
      },
      createdAt: new Date(),
    },
    {
      title: "The Crane Wife",
      text: "A Japanese folktale about a man who marries a mysterious woman who is later revealed to be a crane he once helped.",
      region: "Asia",
      category: "Romantic Tale",
      language: "English",
      approved: true,
      coverImage: "https://example.com/images/crane-wife.jpg",
      author: {
        create: {
          name: "Asian Stories Vault",
          email: "asia@folktales.org",
        },
      },
      tags: {
        create: [{ name: "mythical" }, { name: "sacrifice" }],
      },
      createdAt: new Date(),
    },
    {
      title: "The Bremen Town Musicians",
      text: "Four aging animals (a donkey, dog, cat, and rooster) run away to become musicians and trick robbers from their house.",
      region: "Europe",
      category: "Adventure",
      language: "English",
      approved: true,
      coverImage: "https://example.com/images/bremen-town-musicians.jpg",
      author: {
        create: {
          name: "European Folk Repository",
          email: "europe@folktales.org",
        },
      },
      tags: {
        create: [{ name: "teamwork" }, { name: "cleverness" }],
      },
      createdAt: new Date(),
    },
    // Add more stories with coverImage URLs here as needed
  ];

  for (const storyData of storiesData) {
    const email = storyData.author.create.email;

    const existingAuthor = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAuthor) {
      await prisma.story.create({
        data: {
          ...storyData,
          author: {
            connect: { email },
          },
        },
      });
    } else {
      await prisma.story.create({
        data: storyData,
      });
    }
  }

  console.log("Sample stories with images added successfully.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
