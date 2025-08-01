import React, { useState, useEffect } from "react";

export default function ReflectionBox({ storyId }: { storyId: string }) {
  const storageKey = `reflections-${storyId}`;
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [reflections, setReflections] = useState<
    { name: string; text: string }[]
  >([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setReflections(JSON.parse(stored));
  }, [storageKey]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const newReflection = { name: name || "Anonymous", text };
    const updated = [...reflections, newReflection];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setReflections(updated);
    setText("");
    setName("");
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-sm font-semibold text-gray-700" id="reflection-label">
        Leave a reflection
      </h3>
      <textarea
        id="reflection-text"
        placeholder="What did this story stir in you?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
        rows={4}
        aria-labelledby="reflection-label"
      />
      <input
        type="text"
        id="reflection-name"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
        aria-label="Your name (optional)"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Submit Reflection
      </button>

      {reflections.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Past reflections
          </h4>
          {reflections.map((r, i) => (
            <div
              key={i}
              className="border border-gray-200 p-3 rounded text-sm bg-gray-50"
            >
              <p className="italic text-gray-800">&quot;{r.text}&quot;</p>
              <p className="text-xs text-gray-500 mt-1">— {r.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
