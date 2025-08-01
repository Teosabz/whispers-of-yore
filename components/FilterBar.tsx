import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type Tag = {
  name: string;
};

type StoryFromDB = {
  region: string | null;
  category: string | null;
  tags: Tag[] | null;
};

function formatLabel(str: string) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FilterBar() {
  const router = useRouter();
  const { region, tag, category } = router.query;

  // Extract query params as strings (or empty string)
  const selectedRegion = typeof region === "string" ? region : "";
  const selectedTag = typeof tag === "string" ? tag : "";
  const selectedCategory = typeof category === "string" ? category : "";

  // Local filter state initialized from URL query
  const [currentRegion, setCurrentRegion] = useState<string>(selectedRegion);
  const [currentTag, setCurrentTag] = useState<string>(selectedTag);
  const [currentCategory, setCurrentCategory] =
    useState<string>(selectedCategory);

  const [regions, setRegions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch unique regions, categories, and tags from approved stories only
  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("region, category, tags(name)")
        .eq("approved", true);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }
      if (!data) return;

      const stories = data as StoryFromDB[];

      const uniqueRegions = Array.from(
        new Set(stories.map((s) => s.region).filter((r): r is string => !!r))
      ).sort();

      const uniqueCategories = Array.from(
        new Set(stories.map((s) => s.category).filter((c): c is string => !!c))
      ).sort();

      const allTags = stories.flatMap((s) => s.tags?.map((t) => t.name) ?? []);
      const uniqueTags = Array.from(new Set(allTags.filter(Boolean))).sort();

      setRegions(uniqueRegions);
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    };

    fetchStories();
  }, []);

  // Sync local filter state if URL query changes externally (back/forward buttons)
  useEffect(() => {
    setCurrentRegion(selectedRegion);
    setCurrentTag(selectedTag);
    setCurrentCategory(selectedCategory);
  }, [selectedRegion, selectedTag, selectedCategory]);

  // Update URL query params on filter changes (shallow routing to avoid full reload)
  useEffect(() => {
    const query: Record<string, string> = {};
    if (currentRegion) query.region = currentRegion;
    if (currentTag) query.tag = currentTag;
    if (currentCategory) query.category = currentCategory;

    router.replace({ pathname: "/browse", query }, undefined, {
      shallow: true,
    });
  }, [currentRegion, currentTag, currentCategory, router]);

  return (
    <section className="space-y-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700">Filter Stories</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={currentRegion}
          onChange={(e) => setCurrentRegion(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {formatLabel(r)}
            </option>
          ))}
        </select>

        <select
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {formatLabel(t)}
            </option>
          ))}
        </select>

        <select
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatLabel(c)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setCurrentRegion("");
          setCurrentTag("");
          setCurrentCategory("");
        }}
        className="mt-4 px-4 py-2 bg-yellow-300 hover:bg-yellow-400 rounded"
      >
        Reset Filters
      </button>
    </section>
  );
}
