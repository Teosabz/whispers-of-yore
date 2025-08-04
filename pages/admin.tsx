// pages/admin.tsx

import { useEffect, useState } from "react";
import Header from "../components/Header";
import type { Story } from "../types/models";
import { supabase } from "../lib/supabaseClient";

export default function AdminPanel() {
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending stories from Supabase
  const loadStories = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("status", "pending");

    if (error) {
      console.error("Failed to load stories:", error);
      setError("Failed to load stories.");
      setPendingStories([]);
    } else {
      setPendingStories(data || []);
    }

    setLoading(false);
  };

  // Approve story by updating status to "approved"
  const approveStory = async (id: number) => {
    const { error } = await supabase
      .from("stories")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve story.");
    } else {
      loadStories();
    }
  };

  // Reject story by deleting it
  const rejectStory = async (id: number) => {
    const { error } = await supabase.from("stories").delete().eq("id", id);

    if (error) {
      console.error("Rejection failed:", error);
      alert("Failed to reject story.");
    } else {
      loadStories();
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 bg-yellow-50 min-h-screen">
        <h1 className="text-3xl font-bold text-yellow-900 mb-6 text-center">
          Moderation Panel
        </h1>

        {loading ? (
          <p className="text-center text-yellow-700">
            Loading pending stories...
          </p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : pendingStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingStories.map((story) => (
              <div
                key={story.id}
                className="bg-white border border-yellow-200 rounded-lg shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                    {story.title}
                  </h2>
                  <p className="text-sm text-yellow-800 mb-2 whitespace-pre-line">
                    {story.text.slice(0, 200)}...
                  </p>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>
                      <strong>Region:</strong> {story.region || "Unknown"}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {story.category || "Uncategorized"}
                    </p>
                    <p>
                      <strong>Language:</strong> {story.language || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => approveStory(story.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectStory(story.id)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-yellow-700">
            No pending stories to review.
          </p>
        )}
      </main>
    </>
  );
}
