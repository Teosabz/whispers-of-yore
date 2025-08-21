"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoryList from "@/components/StoryList";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";

export type StoryRow = {
  id: number;
  title: string;
  text: string;
  region?: string;
  category?: string;
  slug?: string;
  cover_image?: string;
  author?: string;
  created_at?: string;
};

export type Region = {
  name: string;
  coordinates: [number, number];
};

// Dynamic import of RegionMap (client-side only)
const RegionMap = dynamic(() => import("@/components/RegionMap"), {
  ssr: false,
});

const PAGE_SIZE = 6;

export default function Home() {
  const session = useSession();

  const [stories, setStories] = useState<StoryRow[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filters
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchStories = useCallback(
    async (reset = false, pageNumber = 0) => {
      setLoading(true);
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (regionFilter) query = query.ilike("region", `%${regionFilter}%`);
      if (categoryFilter)
        query = query.ilike("category", `%${categoryFilter}%`);
      if (searchQuery)
        query = query.or(
          `title.ilike.%${searchQuery}%,text.ilike.%${searchQuery}%`
        );

      const { data, error } = await query.range(from, to);

      if (error) {
        console.error("Error fetching stories:", error.message);
        if (reset) setStories([]);
      } else {
        if (reset) {
          setStories(data || []);
          setPage(1);
        } else {
          setStories((prev) => [...prev, ...(data || [])]);
          setPage(pageNumber + 1);
        }
        setHasMore((data?.length || 0) === PAGE_SIZE);
      }

      setLoading(false);
    },
    [regionFilter, categoryFilter, searchQuery]
  );

  // Fetch favorites for logged-in user
  useEffect(() => {
    if (!session?.user) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("story_id")
        .eq("user_id", session.user.id);

      if (error) console.error("Error fetching favorites:", error.message);
      else setFavorites(data?.map((f) => f.story_id) || []);
    };

    fetchFavorites();
  }, [session]);

  // Fetch stories whenever filters or search query changes (with debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStories(true, 0);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [fetchStories, searchQuery, regionFilter, categoryFilter]);

  const toggleFav = async (storyId: number) => {
    if (!session?.user) return;

    if (favorites.includes(storyId)) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("story_id", storyId);

      if (error) console.error("Error removing favorite:", error.message);
      else setFavorites((prev) => prev.filter((id) => id !== storyId));
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: session.user.id,
        story_id: storyId,
      });

      if (error) console.error("Error adding favorite:", error.message);
      else setFavorites((prev) => [...prev, storyId]);
    }
  };

  const getRegionName = (region?: string) => region || "Unknown";
  const getCategoryName = (category?: string) => category || "Uncategorized";

  const availableRegions: Region[] = [
    { name: "Africa", coordinates: [1.5, 17.5] },
    { name: "Asia", coordinates: [34.5, 100.0] },
    { name: "Europe", coordinates: [54.0, 15.0] },
    { name: "North America", coordinates: [54.0, -105.0] },
    { name: "South America", coordinates: [-14.0, -60.0] },
    { name: "Oceania", coordinates: [-22.0, 140.0] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col mx-2">
      {/* Navbar */}
      <section className="w-full mt-1">
        <Navbar />
      </section>

      {/* Hero */}
      <section className="relative w-full">
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          onSearch={() => fetchStories(true, 0)}
        />
      </section>

      {/* Story List */}
      <section className="w-full py-12 flex-1 bg-purple-50 backdrop-blur-md border border-purple-600 rounded my-5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-black text-center">
          Featured Stories
        </h2>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryList
            stories={stories}
            favs={favorites}
            toggleFav={toggleFav}
            getRegionName={getRegionName}
            getCategoryName={getCategoryName}
          />

          {hasMore && (
            <div className="flex justify-center mt-6 sm:mt-10">
              <button
                onClick={() => fetchStories(false, page)}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-black/30 text-black font-semibold shadow-md hover:bg-black/50 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Region Map */}
      <section className="w-full py-4 sm:py-12 bg-purple-50 border border-purple-600 rounded my-5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-black text-center">
            Explore by Region
          </h2>
          <RegionMap
            selectedRegion={regionFilter}
            onRegionClick={(region) => setRegionFilter(region)}
            availableRegions={availableRegions}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
