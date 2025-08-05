import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

type Story = {
  id: number;
  title: string;
  slug: string;
  region: string;
  category: string;
  cover_image?: string | null;
  tags: { name: string }[];
  created_at: string;
};

const PAGE_SIZE = 6;

export default function BrowsePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadStories = async (offset: number) => {
    setLoading(true);

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
        story_tags (
          tags (
            name
          )
        )
      `
      )
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Supabase fetch error:", error);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedStories: Story[] = data.map((story: any) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      region: story.region,
      category: story.category,
      cover_image: story.cover_image,
      created_at: story.created_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: (story.story_tags ?? []).map((st: any) => st.tags),
    }));

    if (offset === 0) {
      setStories(mappedStories);
    } else {
      setStories((prev) => [...prev, ...mappedStories]);
    }

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStories(0);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    loadStories(nextPage * PAGE_SIZE);
    setPage(nextPage);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen bg-yellow-50">
      <button
        onClick={() => window.history.back()}
        className="mb-6 px-4 py-2 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400 transition"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-900">
        Browse Stories
      </h1>

      {stories.length === 0 && !loading && (
        <p className="text-yellow-700 text-center">No stories found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/story/${story.slug}`}
            className="bg-white border border-yellow-300 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col overflow-hidden"
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
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                  {story.title}
                </h2>
                <p className="text-sm text-yellow-800 mb-1">
                  <strong>Region:</strong> {story.region}
                </p>
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Category:</strong> {story.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="bg-yellow-200 text-yellow-900 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <p className="text-yellow-700 text-center mt-4">Loading...</p>
      )}

      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className="mt-8 px-6 py-2 bg-yellow-600 text-yellow-100 rounded-full hover:bg-yellow-700 block mx-auto transition"
        >
          Load More
        </button>
      )}

      {!hasMore && (
        <p className="text-yellow-700 text-center mt-4">
          No more stories to load.
        </p>
      )}
    </div>
  );
}
