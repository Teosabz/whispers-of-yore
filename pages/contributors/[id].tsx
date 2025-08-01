import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import type { Story } from "../../types/models";

export default function ContributorPage() {
  const router = useRouter();
  const { id } = router.query;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const data = await res.json();
        const filtered = data.filter(
          (story: Story) => story.author?.id === Number(id) && story.approved
        );
        setStories(filtered);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [id]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Contributor Profile</h1>
        <p className="text-gray-600">Stories by contributor #{id}</p>

        {loading ? (
          <p className="text-gray-500">Loading stories...</p>
        ) : stories.length > 0 ? (
          <ul className="space-y-4">
            {stories.map((story) => (
              <li key={story.id} className="border p-4 rounded">
                <h3 className="font-bold text-lg">{story.title}</h3>
                <p className="text-sm text-gray-700">
                  {story.text.slice(0, 120)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tags: {story.tags.map((tag) => `#${tag.name}`).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No approved stories from this contributor yet.
          </p>
        )}
      </main>
    </>
  );
}
