import { useEffect, useState } from "react";
import Link from "next/link";
import type { Story } from "../types/models";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the input query by 300ms
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch all stories, extract tags and authors once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/stories");
        if (!res.ok) throw new Error("Failed to fetch stories");
        const stories: Story[] = await res.json();

        const tags = new Set<string>();
        const authors = new Set<string>();

        stories.forEach((story) => {
          story.tags.forEach((t) => tags.add(t.name));
          if (story.author?.name) authors.add(story.author.name);
        });

        setAllTags([...tags]);
        setAllAuthors([...authors]);
      } catch (error) {
        console.error("Error loading stories for search:", error);
      }
    }
    fetchData();
  }, []);

  // Filter tags and authors based on the debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const q = debouncedQuery.toLowerCase();

    const tagMatches = allTags.filter((tag) => tag.toLowerCase().includes(q));
    const authorMatches = allAuthors.filter((name) =>
      name.toLowerCase().includes(q)
    );

    setSuggestions([...tagMatches.map((t) => `#${t}`), ...authorMatches]);
  }, [debouncedQuery, allTags, allAuthors]);

  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search stories, tags, or authors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-4 py-2 rounded"
        aria-label="Search stories, tags, or authors"
        spellCheck={false}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
          {suggestions.map((s) => {
            const href = s.startsWith("#")
              ? `/tags/${encodeURIComponent(s.slice(1))}`
              : `/authors/${encodeURIComponent(s)}`;
            return (
              <li key={s}>
                <Link
                  href={href}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                >
                  {s}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
