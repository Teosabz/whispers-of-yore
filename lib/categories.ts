// lib/categories.ts
const categoryMap: Record<string, string> = {
  myth: "Myth",
  folktale: "Folktale",
  legend: "Legend",
  fairy: "Fairy Tale",
  // add more categories here as needed
};

export const getCategoryName = (category?: string) => {
  if (!category) return "Unknown";
  return categoryMap[category] || "Unknown";
};
