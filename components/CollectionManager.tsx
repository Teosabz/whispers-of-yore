import React, { useEffect, useState } from "react";

type Collection = {
  description?: string;
  storyIds: string[];
};

type Collections = {
  [name: string]: Collection;
};

const STORAGE_KEY = "myNamedCollections";

export default function CollectionManager() {
  const [collections, setCollections] = useState<Collections>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCollections(JSON.parse(stored));
  }, []);

  const saveCollections = (updated: Collections) => {
    setCollections(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName || collections[trimmedName]) return;

    const updated = {
      ...collections,
      [trimmedName]: { description, storyIds: [] },
    };
    saveCollections(updated);
    setName("");
    setDescription("");
  };

  const handleDelete = (collectionName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [collectionName]: _, ...rest } = collections;
    saveCollections(rest);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        🧵 Manage Collections
      </h2>

      <div className="space-y-2 border p-4 rounded">
        <input
          type="text"
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
          aria-label="Collection name"
        />
        <textarea
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={3}
          aria-label="Collection description"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          type="button"
        >
          ➕ Create Collection
        </button>
      </div>

      <ul className="space-y-4">
        {Object.entries(collections).map(([key, value]) => (
          <li key={key} className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-blue-700">{key}</h3>
            {value.description && (
              <p className="text-sm text-gray-600 mt-1">{value.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {value.storyIds.length} stor
              {value.storyIds.length === 1 ? "y" : "ies"} saved
            </p>
            <button
              onClick={() => handleDelete(key)}
              className="text-red-600 hover:underline text-xs mt-2"
              type="button"
              aria-label={`Delete collection ${key}`}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
