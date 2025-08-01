// pages/favorites.tsx
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import Link from "next/link";
import type { Story } from "../types/models";

const favoriteStories: Story[] = [
  {
    id: 1,
    slug: "the-clever-spider",
    title: "The Clever Spider",
    text: "Once upon a time...",
    region: "West Africa",
    category: "Fable",
    language: "English",
    source_url: "https://example.com/spider",
    cover_image: null,
    approved: true,
    created_at: new Date().toISOString(),
    author: { id: 1, name: "John Doe" },
    tags: [{ id: 1, name: "clever" }],
  },
  {
    id: 2,
    slug: "the-laughing-crocodile",
    title: "The Laughing Crocodile",
    text: "A crocodile who could not stop laughing...",
    region: "Southern Africa",
    category: "Myth",
    language: "Shona",
    source_url: "https://example.com/crocodile",
    cover_image: null,
    approved: true,
    created_at: new Date().toISOString(),
    author: { id: 2, name: "Jane Smith" },
    tags: [{ id: 2, name: "laughing" }],
  },
];

export default function Favorites() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-primary">My Favorite Tales</h1>
          <Link href="/" className="btn-tertiary self-start sm:self-center">
            ← Back to Home
          </Link>
        </div>

        <section>
          {favoriteStories.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              You haven&apos;t saved any favorites yet.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
