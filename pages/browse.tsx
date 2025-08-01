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
        story_tag (
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
      tags: (story.story_tag ?? []).map((st: any) => st.tags),
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
    <>
      <div className="max-w-5xl mx-auto p-6 bg-yellow-50 min-h-screen">
        <button
          onClick={() => window.history.back()}
          className="mb-4 px-4 py-2 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-900">
          Browse Stories
        </h1>

        {stories.length === 0 && !loading && (
          <p className="text-yellow-700 text-center">No stories found.</p>
        )}

        <div className="story-grid">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.slug}`}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer block border border-yellow-300"
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
                <h2 className="text-xl font-semibold mb-2 text-yellow-900">
                  {story.title}
                </h2>
                <p className="text-sm text-yellow-700 mb-1">
                  <strong>Region:</strong> {story.region}
                </p>
                <p className="text-sm text-yellow-700 mb-2">
                  <strong>Category:</strong> {story.category}
                </p>
                <div className="text-sm text-yellow-800">
                  {story.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="mr-2 bg-yellow-200 px-2 py-1 rounded-full text-yellow-900"
                    >
                      #{tag.name}
                    </span>
                  ))}
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
            className="mt-6 px-6 py-2 bg-yellow-600 text-yellow-100 rounded-full hover:bg-yellow-700 block mx-auto transition"
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

      <style jsx>{`
        .story-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          /* sm */
          .story-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 768px) {
          /* md */
          .story-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          /* lg */
          .story-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  );
}
