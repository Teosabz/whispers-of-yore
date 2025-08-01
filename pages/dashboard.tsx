import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { supabase } from "../lib/supabaseClient";
import type { Story } from "../types/models";

export default function DashboardPage() {
  const router = useRouter();
  const { authorId } = router.query;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;

    const fetchStories = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("stories")
        .select("*, tags(*)")
        .eq("authorId", authorId);

      if (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]);
      } else {
        setStories(data || []);
      }

      setLoading(false);
    };

    fetchStories();
  }, [authorId]);

  const approved = stories.filter((s) => s.status === "approved");
  const pending = stories.filter((s) => s.status === "pending");

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>

        {!authorId ? (
          <p className="text-gray-500">
            Please provide your contributor ID in the URL:{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">
              ?authorId=123
            </code>
          </p>
        ) : loading ? (
          <p className="text-gray-500">Loading your stories...</p>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
                Approved Stories
              </h2>
              {approved.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {approved.map((s) => (
                    <li
                      key={s.id}
                      className="border rounded-md p-4 bg-white dark:bg-gray-800"
                    >
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {s.text.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Tags: {s.tags?.map((t) => `#${t.name}`).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No approved stories yet.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-3 text-yellow-800 dark:text-yellow-300">
                Pending Stories
              </h2>
              {pending.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {pending.map((s) => (
                    <li
                      key={s.id}
                      className="border rounded-md p-4 bg-white dark:bg-gray-800"
                    >
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {s.text.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Tags: {s.tags?.map((t) => `#${t.name}`).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No pending stories found.</p>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
