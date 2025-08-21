"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import StoryList from "@/components/StoryList";
import { Story } from "@/components/StoryCard";
import { getRegionName } from "@/lib/regions";
import { getCategoryName } from "@/lib/categories";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        if (!userId) return;

        // Get favorite story IDs
        const { data: favData, error: favError } = await supabase
          .from("favorites")
          .select("story_id")
          .eq("user_id", userId);

        if (favError) throw favError;

        const favIds = favData?.map((f) => f.story_id) || [];
        setFavorites(favIds);

        if (favIds.length > 0) {
          // Fetch story data for favorite IDs
          const { data: storyData, error: storyError } = await supabase
            .from("stories")
            .select("*")
            .in("id", favIds)
            .order("id", { ascending: false });

          if (storyError) throw storyError;

          setStories(storyData as Story[]);
        } else {
          setStories([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFav = async (storyId: number) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      if (favorites.includes(storyId)) {
        // Remove favorite
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("story_id", storyId);
        setFavorites((prev) => prev.filter((id) => id !== storyId));
        setStories((prev) => prev.filter((s) => s.id !== storyId));
      } else {
        // Add favorite
        await supabase
          .from("favorites")
          .insert({ user_id: userId, story_id: storyId });
        setFavorites((prev) => [...prev, storyId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-6 text-center sm:text-left">
        My Favorites
      </h1>

      {loading ? (
        <p className="text-gray-600 text-center mt-8">Loading favorites...</p>
      ) : stories.length === 0 ? (
        <p className="text-gray-600 text-center mt-8">
          You have no favorite stories yet.
        </p>
      ) : (
        <StoryList
          stories={stories}
          favs={favorites}
          toggleFav={toggleFav}
          getRegionName={getRegionName}
          getCategoryName={getCategoryName}
        />
      )}
    </div>
  );
}
