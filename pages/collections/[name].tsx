import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import type { Story } from "../../types/models";

type Collection = {
  description?: string;
  storyIds: string[];
};

type Collections = {
  [name: string]: Collection;
};

export default function CollectionPage() {
  const router = useRouter();
  const { name } = router.query;
  const folderName = typeof name === "string" ? name : "";

  const [collection, setCollection] = useState<Collection | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!folderName) return;

    const storedCollections = localStorage.getItem("myNamedCollections");
    if (!storedCollections) return;

    const parsed: Collections = JSON.parse(storedCollections);
    const folder = parsed[folderName];
    setCollection(folder);

    if (folder?.storyIds?.length) {
      fetch("/api/stories")
        .then((res) => res.json())
        .then(({ success, data }) => {
          if (!success || !data) return;
          const filtered = data.filter((s: Story) =>
            folder.storyIds.includes(String(s.id))
          );

          setStories(filtered);
        })
        .catch((err) => console.error("Error loading stories:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [folderName]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📁 {folderName}</h1>
        {collection?.description && (
          <p className="text-sm text-gray-600">{collection.description}</p>
        )}

        {loading ? (
          <p className="text-gray-600">Loading stories...</p>
        ) : !collection ? (
          <p className="text-gray-600">Collection not found.</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-600">This folder has no saved stories yet.</p>
        ) : (
          <ul className="space-y-6">
            {stories.map((story) => {
              const reactionKey = `reactions-${story.id}`;
              const reflectionKey = `reflections-${story.id}`;
              const reaction =
                typeof window !== "undefined"
                  ? localStorage.getItem(reactionKey)
                  : null;
              const reflections =
                typeof window !== "undefined"
                  ? JSON.parse(localStorage.getItem(reflectionKey) || "[]")
                  : [];

              return (
                <li
                  key={story.id}
                  className="border p-4 rounded hover:bg-gray-50"
                >
                  <Link href={`/story/${story.id}`}>
                    <h2 className="font-bold text-blue-700 hover:underline">
                      {story.title}
                    </h2>
                  </Link>

                  {story.author?.name && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✍️ Author: {story.author.name}
                    </p>
                  )}

                  <p className="text-sm text-gray-700 mt-1">
                    {story.text.slice(0, 100)}...
                  </p>

                  <div className="mt-2 text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                    <p>📍 Region: {story.region}</p>
                    <p>🗂 Category: {story.category}</p>
                    <p>
                      🏷️ Tags:{" "}
                      {story.tags.map((t: { name: string }) => (
                        <Link key={t.name} href={`/tags/${t.name}`}>
                          <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 mr-1 rounded-full hover:bg-indigo-200">
                            #{t.name}
                          </span>
                        </Link>
                      ))}
                    </p>
                    {reaction && (
                      <p className="text-indigo-600 mt-1">
                        ❤️ Reader reaction: {reaction}
                      </p>
                    )}
                    {reflections.length > 0 && (
                      <p className="text-indigo-600">
                        💬 {reflections.length} reflection
                        {reflections.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
