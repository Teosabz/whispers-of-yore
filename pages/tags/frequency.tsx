import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";

type Tag = {
  name: string;
};

type SupabaseTagRow = {
  tag: Tag[]; // <-- tag is an array of Tag objects
  story_id: number;
};

type TagFrequency = {
  name: string;
  count: number;
};

export default function TagFrequencyPage() {
  const [tagFrequencies, setTagFrequencies] = useState<TagFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      setError(null);

      try {
        // Fetch story_tag rows with joined tag names (tag is an array)
        const { data, error } = await supabase
          .from("story_tag")
          .select("tag:tag_id(name), story_id");

        if (error) throw error;
        if (!data) throw new Error("No data found");

        const tagData = data as SupabaseTagRow[];

        // Count frequencies of tag names
        const tagCountMap: Record<string, number> = {};

        tagData.forEach(({ tag }) => {
          if (tag && tag.length > 0) {
            tag.forEach((t) => {
              if (t.name) {
                tagCountMap[t.name] = (tagCountMap[t.name] || 0) + 1;
              }
            });
          }
        });

        // Convert count map to sorted array
        const frequencies: TagFrequency[] = Object.entries(tagCountMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setTagFrequencies(frequencies);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return (
    <>
      <Head>
        <title>Tag Frequencies</title>
      </Head>

      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Tag Frequency List</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <ul className="space-y-2">
            {tagFrequencies.map(({ name, count }) => (
              <li key={name} className="flex justify-between border-b py-2">
                <span>{name}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
