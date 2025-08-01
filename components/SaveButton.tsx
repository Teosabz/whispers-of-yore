import React, { useEffect, useState } from "react";

type Collection = {
  description?: string;
  storyIds: string[];
};

type Collections = {
  [name: string]: Collection;
};

const STORAGE_KEY = "myNamedCollections";

export default function SaveButton({ storyId }: { storyId: string }) {
  const [collections, setCollections] = useState<Collections>({});
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCollections(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    if (!selectedCollection || !collections[selectedCollection]) return;

    const current = collections[selectedCollection];
    if (current.storyIds.includes(storyId)) {
      setSaved(true); // Already saved, do nothing
      return;
    }

    const updatedCollections = {
      ...collections,
      [selectedCollection]: {
        ...current,
        storyIds: [...current.storyIds, storyId],
      },
    };

    setCollections(updatedCollections);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCollections));
    setSaved(true);
  };

  return (
    <div className="mt-6 space-y-2">
      <label
        htmlFor="collection-select"
        className="text-sm font-semibold text-gray-700 block"
      >
        📂 Save to collection:
      </label>
      <select
        id="collection-select"
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
        className="w-full px-3 py-2 border rounded text-sm"
        aria-label="Select collection to save story"
      >
        <option value="">-- Select a collection --</option>
        {Object.keys(collections).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={!selectedCollection || saved}
        className={`w-full px-4 py-2 text-sm rounded transition-colors duration-200 ${
          saved
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        }`}
        aria-disabled={!selectedCollection || saved}
      >
        {saved ? "✅ Saved" : "➕ Save Story"}
      </button>
    </div>
  );
}
