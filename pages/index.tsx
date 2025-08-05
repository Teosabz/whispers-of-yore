// pages/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import TagCloud from "../components/TagCloud";
import RegionMap from "../components/RegionMap";
import { supabase } from "../lib/supabaseClient";
import { slugify } from "../lib/slugify";

type Story = {
  id: number;
  title: string;
  text: string;
  region: string;
  category: string;
  language?: string;
  created_at?: string;
  author?: { name: string } | null;
  tags: { name: string }[];
  cover_image?: string | null;
  slug?: string | null;
};

const VISIBLE_KEY = "home_visibleCount";
const SCROLL_KEY = "home_scrollY";
const SORT_KEY = "home_sort";
const FILTER_REGION_KEY = "home_filter_region";
const FILTER_CATEGORY_KEY = "home_filter_category";

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [regions, setRegions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const restoreState = () => {
      setVisibleCount(Number(sessionStorage.getItem(VISIBLE_KEY)) || 3);
      setSortBy(
        (sessionStorage.getItem(SORT_KEY) as typeof sortBy) || "newest"
      );
      setRegion(sessionStorage.getItem(FILTER_REGION_KEY) || "");
      setCategory(sessionStorage.getItem(FILTER_CATEGORY_KEY) || "");
    };

    restoreState();

    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("stories")
          .select(
            `
            id,
            title,
            text,
            region,
            category,
            language,
            created_at,
            slug,
            cover_image,
            author:users(name),
            story_tags (
              tags(name)
            )
          `
          )
          .eq("approved", true);

        if (error) throw error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Story[] = (data ?? []).map((story: any) => ({
          id: story.id,
          title: story.title,
          text: story.text,
          region: story.region,
          category: story.category,
          language: story.language,
          created_at: story.created_at,
          slug: story.slug,
          author: story.author ?? null,
          cover_image: story.cover_image,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tags: (story.story_tag ?? []).map((st: any) => st.tags),
        }));

        setStories(mapped);

        const regionSet = new Set<string>();
        const categorySet = new Set<string>();
        mapped.forEach((s) => {
          if (s.region) regionSet.add(s.region);
          if (s.category) categorySet.add(s.category);
        });

        setRegions([...regionSet].sort());
        setCategories([...categorySet].sort());
      } catch (e) {
        console.error("Failed to fetch stories:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(
    () => sessionStorage.setItem(VISIBLE_KEY, String(visibleCount)),
    [visibleCount]
  );
  useEffect(() => sessionStorage.setItem(SORT_KEY, sortBy), [sortBy]);
  useEffect(() => sessionStorage.setItem(FILTER_REGION_KEY, region), [region]);
  useEffect(
    () => sessionStorage.setItem(FILTER_CATEGORY_KEY, category),
    [category]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const y = Number(saved);
      if (!isNaN(y)) {
        setTimeout(() => window.scrollTo(0, y), 0);
      }
    }
    const handleBeforeUnload = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const sorted = [...stories].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return sortBy === "newest" ? bTime - aTime : aTime - bTime;
  });

  const filtered = sorted.filter((s) => {
    const matchesRegion = region ? s.region === region : true;
    const matchesCategory = category ? s.category === category : true;
    return matchesRegion && matchesCategory;
  });

  const displayed = filtered.slice(0, visibleCount);
  const loadMore = () => setVisibleCount((v) => v + 3);
  const resetFilters = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-50 min-h-screen">
        <section className="text-center max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl bg-white shadow-xl border border-yellow-300">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-900 mb-4">
            Whispers of Yore
          </h1>
          <p className="text-base sm:text-lg text-yellow-800 leading-relaxed">
            Preserving ancestral memory and cultural folklore through communal
            storytelling.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/browse" className="btn-primary">
              🔍 Browse
            </Link>
            <Link href="/submit" className="btn-secondary">
              ✍️ Submit
            </Link>
            <Link href="/explore" className="btn-tertiary">
              📚 Explore
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-300 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-6">
            Featured Stories
          </h2>

          <div className="mb-4 text-right">
            <button
              onClick={resetFilters}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 rounded px-4 py-2 font-semibold text-yellow-900"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <label htmlFor="sort" className="text-yellow-700 font-semibold">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-md border border-yellow-400 px-3 py-1 text-yellow-900 font-medium"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-md border border-yellow-400 px-3 py-1 text-yellow-900 font-medium"
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-md border border-yellow-400 px-3 py-1 text-yellow-900 font-medium"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-yellow-700 text-center">Loading stories...</p>
          ) : displayed.length === 0 ? (
            <p className="text-yellow-700 text-center">
              No stories match your selection.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {displayed.map((story) => (
                <Link
                  key={story.id}
                  href={`/story/${story.slug || slugify(story.title)}`}
                  className="group block rounded-xl overflow-hidden shadow-lg border border-yellow-300 bg-white hover:shadow-2xl transition"
                >
                  <Image
                    src={
                      story.cover_image && story.cover_image.trim() !== ""
                        ? story.cover_image
                        : "https://source.unsplash.com/400x225/?folktale,story"
                    }
                    alt={story.title}
                    width={400}
                    height={225}
                    className="object-cover w-full"
                    unoptimized
                  />
                  <div className="p-4 flex flex-col h-56">
                    <h3 className="text-xl font-bold text-yellow-900 mb-2 group-hover:text-yellow-700 truncate">
                      {story.title}
                    </h3>
                    <p className="text-xs text-yellow-700 mb-2">
                      {story.author?.name ? `By ${story.author.name} • ` : ""}
                      {story.created_at
                        ? new Date(story.created_at).toLocaleDateString()
                        : ""}
                    </p>
                    <p className="text-sm text-yellow-800 flex-1 overflow-hidden">
                      {story.text.length > 160
                        ? story.text.slice(0, 160) + "..."
                        : story.text}
                    </p>
                    {story.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {story.tags.map((t) => (
                          <span
                            key={t.name}
                            className="text-xs bg-yellow-200 rounded-full px-2 py-0.5 text-yellow-800"
                          >
                            #{t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-yellow-600">
                      🌍 {story.region} • 🏷 {story.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && visibleCount < filtered.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>

        <section className="max-w-6xl mx-auto mt-16">
          <RegionMap />
        </section>
        <section className="max-w-6xl mx-auto mt-16">
          <TagCloud />
        </section>

        <section className="text-center text-yellow-800 mt-12 mb-20 px-4 sm:px-0 max-w-3xl mx-auto text-sm">
          Share your voice, story, or ancestral thread. Every submission adds to
          the archive&apos;s living memory.
        </section>
      </main>

      <footer className="bg-yellow-600 text-yellow-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Whispers of Yore. All rights reserved.
          </p>
          <p className="text-sm">Crafted with care by Matthew Sabeta</p>
        </div>
      </footer>

      <style jsx global>{`
        .btn-primary {
          @apply bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-700 transition;
        }
        .btn-secondary {
          @apply bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition;
        }
        .btn-tertiary {
          @apply bg-yellow-300 text-yellow-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition;
        }
      `}</style>
    </>
  );
}
