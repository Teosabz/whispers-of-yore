import React from "react";

export default function RemoveButton({
  storyId,
  onRemove,
}: {
  storyId: string;
  onRemove?: () => void;
}) {
  const handleRemove = () => {
    try {
      const stored = localStorage.getItem("myCollection");
      const saved: string[] = stored ? JSON.parse(stored) : [];

      const updated = saved.filter((id) => id !== storyId);
      localStorage.setItem("myCollection", JSON.stringify(updated));
      alert("🗑️ Removed from your collection.");
      if (onRemove) onRemove();
    } catch (error) {
      console.error("Error removing story:", error);
      alert("❌ Could not remove story.");
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleRemove}
        type="button"
        className="flex items-center space-x-1 text-red-600 hover:underline text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        aria-label="Remove story from collection"
      >
        <span>❌</span>
        <span>Remove from Collection</span>
      </button>
    </div>
  );
}
