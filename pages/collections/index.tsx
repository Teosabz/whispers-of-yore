import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";

type Collection = {
  description?: string;
  storyIds: string[];
};

type Collections = {
  [name: string]: Collection;
};

export default function CollectionsIndex() {
  const [collections, setCollections] = useState<Collections>({});

  useEffect(() => {
    const stored = localStorage.getItem("myNamedCollections");
    if (stored) setCollections(JSON.parse(stored));
  }, []);

  const sortedKeys = Object.keys(collections).sort((a, b) => {
    const aCount = collections[a].storyIds.length;
    const bCount = collections[b].storyIds.length;
    return bCount - aCount;
  });

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 All Collections</h1>

        {sortedKeys.length === 0 ? (
          <p className="text-gray-600">
            No collections have been created yet. You can start one in the story
            view or in the Collection Manager.
          </p>
        ) : (
          <ul className="space-y-6">
            {sortedKeys.map((key) => {
              const folder = collections[key];
              return (
                <li key={key} className="border p-4 rounded hover:bg-gray-50">
                  <Link href={`/collections/${encodeURIComponent(key)}`}>
                    <h2 className="font-bold text-blue-700 hover:underline text-lg">
                      📁 {key}
                    </h2>
                    {folder.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {folder.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {folder.storyIds.length} stor
                      {folder.storyIds.length === 1 ? "y" : "ies"} curated
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
