import React, { useState, useEffect } from "react";

const REACTIONS = [
  "❤️ Moved",
  "✨ Inspired",
  "😢 Heartbroken",
  "🔥 Angry",
  "🧘 Healed",
];

export default function ReactionBar({ storyId }: { storyId: string }) {
  const storageKey = `reactions-${storyId}`;
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setSelected(stored);
  }, [storageKey]);

  const handleSelect = (reaction: string) => {
    if (selected === reaction) {
      setSelected(null);
      localStorage.removeItem(storageKey);
    } else {
      setSelected(reaction);
      localStorage.setItem(storageKey, reaction);
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <p className="text-sm font-semibold text-gray-700">
        How did this story make you feel?
      </p>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={selected === r}
            onClick={() => handleSelect(r)}
            className={`text-sm px-3 py-1 rounded border ${
              selected === r ? "bg-blue-100 border-blue-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
