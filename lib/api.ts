import type { Story } from "../types/models";

export async function fetchStories(): Promise<Story[]> {
  const res = await fetch("/api/stories");
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}
