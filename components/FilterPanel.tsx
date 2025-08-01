import React from "react";

interface FilterPanelProps {
  selectedRegion: string;
  selectedCategory: string;
  onRegionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedRegion,
  selectedCategory,
  onRegionChange,
  onCategoryChange,
}) => {
  const regions = [
    "West Africa",
    "East Asia",
    "Southern Europe",
    "Southern Africa",
  ];
  const categories = ["Myth", "Legend", "Fable", "Trickster Tale"];

  return (
    <div className="flex flex-col gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label className="text-sm font-medium block mb-1">Region</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Category</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
