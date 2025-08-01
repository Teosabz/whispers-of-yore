// lib/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with dash
}
