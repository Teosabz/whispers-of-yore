// components/TagCloud.tsx
import React from "react";

type TagCloudProps = {
  onTagClick: (tag: string) => void;
};

const tags = [
  "Myth",
  "Legend",
  "Fable",
  "Folktale",
  "Fairy Tale",
  "Story",
  "Adventure",
];

export default function TagCloud({ onTagClick }: TagCloudProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-full hover:scale-105 transition-transform"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
