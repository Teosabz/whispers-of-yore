import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import type { Story } from "../types/models";

export default function EditStoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchStory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stories/${id}`);
        const json = await res.json();

        if (json.success) {
          setStory(json.data);
        } else {
          setStory(null);
        }
      } catch (err) {
        console.error("Failed to load story:", err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleSave = async () => {
    if (!story) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });

      if (res.ok) {
        setMessage("Story updated successfully.");
      } else {
        const errorJson = await res.json();
        setMessage(errorJson.error || "Failed to update story.");
      }
    } catch (err) {
      console.error("Error saving story:", err);
      setMessage("Error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 p-4">Loading story...</p>;
  if (!story) return <p className="text-red-500 p-4">Story not found.</p>;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Edit Story</h1>

        <input
          type="text"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
          placeholder="Title"
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <textarea
          value={story.text}
          onChange={(e) => setStory({ ...story, text: e.target.value })}
          rows={10}
          placeholder="Story text..."
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <input
          type="text"
          value={story.region}
          onChange={(e) => setStory({ ...story, region: e.target.value })}
          placeholder="Region"
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <input
          type="text"
          value={story.category}
          onChange={(e) => setStory({ ...story, category: e.target.value })}
          placeholder="Category"
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <input
          type="text"
          value={story.language}
          onChange={(e) => setStory({ ...story, language: e.target.value })}
          placeholder="Language"
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <input
          type="text"
          value={story.tags.map((t) => t.name).join(", ")}
          onChange={(e) =>
            setStory({
              ...story,
              tags: e.target.value
                .split(",")
                .map((name) => ({ id: 0, name: name.trim() })), // You can omit id if you want
            })
          }
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          disabled={saving}
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
      </main>
    </>
  );
}
