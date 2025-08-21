"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const router = useRouter();

  const goToRandomStory = async () => {
    setLoadingRandom(true);
    try {
      const { data, error } = await supabase.rpc("get_random_story");
      if (error) throw error;
      if (!data) return;

      // Handle array or single object
      const story = Array.isArray(data) ? data[0] : data;

      if (story?.id) {
        router.push(`/story/${story.id}`);
      } else {
        console.error("Random story ID invalid:", story);
      }
    } catch (err) {
      console.error("Error fetching random story:", err);
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border border-purple-700 rounded">
      <div
        className="w-full"
        style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-white">
              <Link href="/">Whispers of Yore</Link>
            </div>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/browse"
                className="text-white font-medium hover:bg-white/20 transition duration-300 px-4 py-1 rounded-full hover:border border-white/20"
              >
                Browse
              </Link>
              <Link
                href="/favorites"
                className="text-white font-medium hover:bg-white/20 transition duration-300 px-4 py-1 rounded-full hover:border border-white/20"
              >
                Favorites
              </Link>
              <button
                onClick={goToRandomStory}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition duration-300"
                disabled={loadingRandom}
              >
                {loadingRandom ? "Loading..." : "Random story"}
              </button>
            </nav>

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

          {isOpen && (
            <nav
              className="md:hidden flex flex-col gap-3 py-4 text-center"
              style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
            >
              <Link
                href="/browse"
                className="text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/favorites"
                className="text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                Favorites
              </Link>
              <button
                onClick={() => {
                  goToRandomStory();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition duration-300 mx-auto"
              >
                Random story
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
