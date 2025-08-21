// lib/regions.ts
export const getRegionName = (region?: string) => {
  switch (region) {
    case "africa":
      return "Africa";
    case "asia":
      return "Asia";
    case "europe":
      return "Europe";
    default:
      return "Unknown";
  }
};
