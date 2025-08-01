import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Link from "next/link";
import type { Story } from "../../types/models";

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tag) return;

    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const allStories: Story[] = await res.json();

        const filtered = allStories.filter((story) =>
          story.tags.some(
            (t) => t.name.toLowerCase() === String(tag).toLowerCase()
          )
        );

        setStories(filtered);
      } catch (err) {
        console.error("Error fetching tag stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [tag]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Link href="/browse" className="text-sm text-blue-600 hover:underline">
          ← Back to Browse
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">
          🏷️ Stories Tagged &quot;{tag}&quot;
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-600">
            No stories found for tag &quot;{tag}&quot;.
          </p>
        ) : (
          <ul className="space-y-4">
            {stories.map((story) => (
              <li
                key={story.id}
                className="border p-4 rounded hover:bg-gray-50 transition"
              >
                <Link href={`/story/${story.id}`}>
                  <h2 className="font-bold text-blue-700 hover:underline">
                    {story.title}
                  </h2>
                  <p className="text-sm text-gray-700 mt-1">
                    {story.text.slice(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Region: {story.region} | Category: {story.category} | Tags:{" "}
                    {story.tags.map((t) => (
                      <Link key={t.name} href={`/tags/${t.name}`}>
                        #{t.name}
                      </Link>
                    ))}
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
