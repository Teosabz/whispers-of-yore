import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { getCategoryName } from "@/lib/categories";

export type Story = {
  id: number;
  title: string;
  text: string;
  region?: string;
  category?: string;
  cover_image?: string | null;
  slug?: string;
  author?: string;
};

export default function StoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStory = async () => {
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", Number(id))
          .single();

        if (error) {
          console.error("Error fetching story:", error.message);
          setStory(null);
        } else {
          setStory(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching story:", err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!story) return <p className="text-center mt-20">Story not found.</p>;

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar currentStoryId={story.id} />

      <main className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-4 text-purple-900">
          {story.title}
        </h1>

        {story.author && (
          <p className="text-sm text-gray-600 mb-2">By {story.author}</p>
        )}

        <div className="flex gap-2 mb-6 flex-wrap text-xs">
          {story.region && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {story.region}
            </span>
          )}
          {story.category && (
            <span className="border border-purple-300 px-2 py-1 rounded">
              {getCategoryName(story.category)}
            </span>
          )}
        </div>

        {story.cover_image && (
          <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden">
            <Image
              src={story.cover_image}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-gray-700 text-lg whitespace-pre-line">
          {story.text}
        </p>
      </main>
    </div>
  );
}
