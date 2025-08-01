// pages/motif/[name].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { supabase } from "../../lib/supabaseClient";
import type { Story } from "../../types/models";

export default function MotifPage() {
  const router = useRouter();
  const { name } = router.query;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    const fetchStoriesByTag = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("stories")
        .select("*, tags(name)")
        .contains("tags", [{ name }]) // works if you're storing tag objects in a JSON array
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching stories by tag:", error);
        setStories([]);
      } else {
        setStories(data || []);
      }

      setLoading(false);
    };

    fetchStoriesByTag();
  }, [name]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold capitalize">#{name}</h1>
        <p className="text-gray-600">
          Folktales categorized under the “{name}” motif.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-500">No stories found for this motif.</p>
        ) : (
          <ul className="space-y-4">
            {stories.map((story) => (
              <li key={story.id} className="border p-4 rounded shadow bg-white">
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-700 text-sm mt-2">
                  {story.text.slice(0, 200)}...
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  Region: {story.region} | Language: {story.language}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
