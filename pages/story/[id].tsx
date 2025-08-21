"use client";

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
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <Navbar currentStoryId={story.id} />

      <main className="relative max-w-4xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 z-10">
        {/* Back Home Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-sm sm:text-base"
        >
          ← Back to Home
        </button>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-purple-900">
          {story.title}
        </h1>

        {/* Author */}
        {story.author && (
          <p className="text-sm sm:text-base text-gray-100 mb-2">
            By {story.author}
          </p>
        )}

        {/* Tags */}
        <div className="flex gap-2 mb-6 flex-wrap text-xs sm:text-sm">
          {story.region && (
            <span className="bg-purple-700/30 text-white px-2 py-1 rounded">
              {story.region}
            </span>
          )}
          {story.category && (
            <span className="border border-purple-300 px-2 py-1 rounded text-white/90">
              {getCategoryName(story.category)}
            </span>
          )}
        </div>

        {/* Cover Image */}
        {story.cover_image && (
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 mb-6 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={story.cover_image}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Story Text */}
        <p className="text-gray-100 text-base sm:text-lg md:text-xl lg:text-2xl whitespace-pre-line leading-relaxed">
          {story.text}
        </p>
      </main>
    </div>
  );
}
