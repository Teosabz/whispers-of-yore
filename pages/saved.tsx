import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import type { Story } from "../types/models";

export default function SavedPage() {
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const allStories: Story[] = await res.json();

        const savedIds: number[] = JSON.parse(
          localStorage.getItem("savedStories") || "[]"
        );

        const filtered = allStories.filter((story) =>
          savedIds.includes(story.id)
        );

        setSavedStories(filtered);
      } catch (err) {
        console.error("Error fetching saved stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStories();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">
          My Saved Stories
        </h1>

        {loading ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            Loading saved stories...
          </p>
        ) : savedStories.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">
            You haven&apos;t saved any stories yet.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {savedStories.map((story) => (
              <li
                key={story.id}
                className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 shadow hover:shadow-md transition"
              >
                <Link href={`/story/${story.slug}`}>
                  <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 hover:underline mb-2">
                    {story.title}
                  </h2>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
                    {story.text.slice(0, 120)}...
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Region: {story.region} | Category: {story.category}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tags: {story.tags.map((t) => `#${t.name}`).join(", ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
