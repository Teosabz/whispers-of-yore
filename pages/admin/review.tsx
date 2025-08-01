import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StoryCard from "../../components/StoryCard";
import type { Story } from "../../types/models";

export default function ModerationDashboard() {
  const [pending, setPending] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/stories?all=true");
      const data = await res.json();
      const unapproved = data.filter((s: Story) => !s.approved);
      setPending(unapproved);
    } catch (err) {
      console.error("Failed to load stories:", err);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      fetchPending(); // Refresh list
    } catch (err) {
      console.error("Failed to approve story:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });
      fetchPending(); // Refresh list
    } catch (err) {
      console.error("Failed to delete story:", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Review Story Submissions</h1>
        {loading ? (
          <p className="text-gray-500">Loading pending stories...</p>
        ) : pending.length > 0 ? (
          <div className="space-y-6">
            {pending.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No stories pending review. Archive is up to date!
          </p>
        )}
      </main>
    </>
  );
}
