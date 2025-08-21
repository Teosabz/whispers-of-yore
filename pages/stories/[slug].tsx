// pages/stories/[slug].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { StoryRow } from "../index"; // reuse your StoryRow type

export default function StoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [story, setStory] = useState<StoryRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchStory = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching story:", error.message);
      } else {
        setStory(data);
      }
      setLoading(false);
    };

    fetchStory();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading story...</p>;
  if (!story) return <p className="text-center mt-10">Story not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {story.cover_image && (
        <Image
          src={story.cover_image}
          alt={story.title}
          width={800}
          height={400}
          className="rounded-2xl mb-6 w-full h-64 object-cover"
        />
      )}

      <h1 className="text-4xl font-extrabold mb-4 text-purple-900">
        {story.title}
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        {story.region} | {story.category}{" "}
        {story.author && `| By ${story.author}`}
      </p>
      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {story.text}
      </p>

      <button
        onClick={() => router.back()}
        className="mt-8 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
      >
        ← Back
      </button>
    </div>
  );
}
