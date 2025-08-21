"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface NavbarProps {
  currentStoryId?: number;
}

export default function Navbar({ currentStoryId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  // Get logged-in user
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUserId(data.session.user.id);
    };
    getSession();
  }, []);

  // Check if current story is favorited
  useEffect(() => {
    if (!userId || !currentStoryId) return;

    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("story_id", currentStoryId)
        .single();
      setIsFavorited(!!data);
    };

    checkFavorite();
  }, [userId, currentStoryId]);

  const toggleFavorite = async () => {
    if (!userId || !currentStoryId) {
      router.push("/login");
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("story_id", currentStoryId);
        setIsFavorited(false);
      } else {
        await supabase.from("favorites").insert({
          user_id: userId,
          story_id: currentStoryId,
        });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const goToFavorites = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    router.push("/favorites");
  };

  const goToRandomStory = async () => {
    setLoadingRandom(true);
    try {
      const { data, error } = await supabase.rpc("get_random_story");
      if (error) throw error;
      const story = Array.isArray(data) ? data[0] : data;
      if (story?.id) router.push(`/story/${story.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border border-purple-700 rounded">
      <div
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-white">
              <Link href="/">Whispers of Yore</Link>
            </div>

            {/* Desktop / Tablet */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link
                href="/browse"
                className="text-white font-medium hover:bg-white/20 transition duration-300 px-4 py-1 rounded-full hover:border border-white/20"
              >
                Browse
              </Link>

              {userId && (
                <>
                  <button
                    onClick={goToFavorites}
                    className="text-white font-medium hover:bg-white/20 transition duration-300 px-4 py-1 rounded-full hover:border border-white/20"
                  >
                    Favorites
                  </button>

                  {currentStoryId && (
                    <button
                      onClick={toggleFavorite}
                      className="text-white font-medium px-2 py-1 rounded-full"
                      title={
                        isFavorited
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorited ? (
                        <HiHeart className="h-6 w-6 text-red-500" />
                      ) : (
                        <HiOutlineHeart className="h-6 w-6" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      supabase.auth.signOut().then(() => router.push("/login"))
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              )}

              {!userId && (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition duration-300"
                >
                  Login
                </Link>
              )}

              <button
                onClick={goToRandomStory}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition duration-300"
                disabled={loadingRandom}
              >
                {loadingRandom ? "Loading..." : "Random Story"}
              </button>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
              >
                {isOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden flex flex-col gap-3 py-4 text-center bg-black/70">
              <Link
                href="/browse"
                className="text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                Browse
              </Link>

              {userId ? (
                <>
                  <button
                    onClick={() => {
                      goToFavorites();
                      setIsOpen(false);
                    }}
                    className="text-white font-medium"
                  >
                    Favorites
                  </button>

                  {currentStoryId && (
                    <button
                      onClick={() => {
                        toggleFavorite();
                        setIsOpen(false);
                      }}
                      className="text-white font-medium"
                    >
                      {isFavorited ? "💖 Remove Favorite" : "🤍 Add Favorite"}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      supabase.auth.signOut().then(() => router.push("/login"));
                      setIsOpen(false);
                    }}
                    className="text-white font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-white font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => {
                  goToRandomStory();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition duration-300 mx-auto"
              >
                Random Story
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
