// pages/explore.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

type Tag = {
  name: string;
};

type StoryTag = {
  tags: Tag;
};

type RawStory = {
  id: number;
  title: string;
  slug: string;
  region: string;
  category: string;
  cover_image?: string | null;
  created_at: string;
  story_tag?: StoryTag[];
};

type Story = {
  id: number;
  title: string;
  slug: string;
  region: string;
  category: string;
  cover_image?: string | null;
  tags: Tag[];
  created_at: string;
};

const PAGE_SIZE = 9;

export default function ExplorePage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchStories = async (pageIndex = 0) => {
    setLoading(true);

    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("stories")
      .select(
        `
        id,
        title,
        slug,
        region,
        category,
        cover_image,
        created_at,
        story_tag (
          tags (
            name
          )
        )
      `
      )
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching stories:", error);
      setLoading(false);
      return;
    }

    const rawStories = data as unknown as RawStory[];

    const mappedStories: Story[] = rawStories.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      region: story.region,
      category: story.category,
      cover_image: story.cover_image,
      created_at: story.created_at,
      tags: (story.story_tag ?? []).map((st) => st.tags),
    }));

    setStories((prev) => [...prev, ...mappedStories]);
    setHasMore(mappedStories.length === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-yellow-900 mb-6 text-center">
        Explore Stories
      </h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded bg-yellow-600 text-yellow-100 hover:bg-yellow-700 transition"
        >
          ← Back to Home
        </button>
      </div>

      {loading && stories.length === 0 && (
        <p className="text-yellow-700 text-center mb-6">Loading stories...</p>
      )}

      {!loading && stories.length === 0 && (
        <p className="text-yellow-700 text-center">No stories found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/story/${story.slug}`}
            className="block bg-white rounded-lg shadow-md border border-yellow-300 hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
          >
            {story.cover_image && (
              <Image
                src={story.cover_image}
                alt={story.title}
                width={800}
                height={450}
                className="w-full h-48 object-cover"
                unoptimized
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                {story.title}
              </h2>
              <p className="text-sm text-yellow-700 mb-1">
                <strong>Region:</strong> {story.region}
              </p>
              <p className="text-sm text-yellow-700 mb-2">
                <strong>Category:</strong> {story.category}
              </p>
              <div className="flex flex-wrap gap-2 text-yellow-800 text-sm">
                {story.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 rounded bg-yellow-700 text-yellow-100 hover:bg-yellow-800 transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
