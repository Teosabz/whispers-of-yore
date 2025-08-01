import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type Tag = {
  id: number;
  name: string;
};

export default function TagCloud() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      } else {
        setTags(data || []);
      }
      setLoading(false);
    };

    fetchTags();
  }, []);

  if (loading) {
    return <p className="text-yellow-700">Loading motifs...</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-center">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/motif/${tag.name.toLowerCase()}`} passHref>
            <a
              className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-yellow-300 transition cursor-pointer"
              aria-label={`Browse motif ${tag.name}`}
            >
              #{tag.name}
            </a>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 639px) {
          a {
            font-size: 0.75rem; /* text-xs */
            padding: 0.25rem 0.75rem;
          }
        }
        @media (min-width: 640px) {
          a {
            font-size: 0.875rem; /* text-sm */
            padding: 0.25rem 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
