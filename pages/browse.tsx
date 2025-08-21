"use client";

import { useState, useEffect } from "react";
import StoryList from "@/components/StoryList";
import { supabase } from "@/lib/supabaseClient";
import { Story } from "@/components/StoryCard";
import { getCategoryName } from "@/lib/categories";
import { getRegionName } from "@/lib/regions";

export default function BrowsePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setStories(data as Story[]);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Update filteredStories whenever filters or stories change
  useEffect(() => {
    let temp = stories;

    if (selectedRegion) {
      temp = temp.filter((s) => s.region === selectedRegion);
    }
    if (selectedCategory) {
      temp = temp.filter((s) => s.category === selectedCategory);
    }

    setFilteredStories(temp);
  }, [stories, selectedRegion, selectedCategory]);

  const toggleFav = (id: number) => {
    console.log("Toggle favorite for story ID:", id);
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Browse Tales</h1>

      {/* Filter Panel */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {/* Region Filter */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Americas">Americas</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">All Categories</option>
          <option value="myth">Myth</option>
          <option value="folktale">Folktale</option>
          <option value="legend">Legend</option>
        </select>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSelectedRegion("");
            setSelectedCategory("");
          }}
          className="px-3 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Story List */}
      {loading ? (
        <p className="text-gray-600">Loading stories...</p>
      ) : (
        <StoryList
          stories={filteredStories}
          favs={[]}
          toggleFav={toggleFav}
          getRegionName={getRegionName}
          getCategoryName={getCategoryName}
        />
      )}
    </div>
  );
}
