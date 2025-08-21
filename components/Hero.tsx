"use client";

import React from "react";

type HeroProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  onSearch: () => void;
};

export default function Hero({
  searchQuery,
  setSearchQuery,
  regionFilter,
  setRegionFilter,
  categoryFilter,
  setCategoryFilter,
  onSearch,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 border border-purple-700 rounded my-5">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight drop-shadow-lg">
          Whispers of Yore
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-6 sm:mb-8 md:mb-10 mx-auto">
          Discover timeless folktales from across cultures, passed down through
          generations.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-4 sm:mb-6 md:mb-8 flex gap-2">
          <input
            type="text"
            placeholder="Search for a story..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 sm:px-5 py-2 sm:py-3 rounded-2xl bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-md border border-gray-400"
          />
          <button
            onClick={onSearch}
            className="px-4 sm:px-5 py-2 sm:py-3 bg-purple-700 hover:bg-purple-800 rounded-2xl text-white font-semibold transition"
          >
            Search
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-3 sm:gap-5">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-black/30 text-white backdrop-blur-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Oceania">Oceania</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-black/30 text-white backdrop-blur-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="Myths">Myths</option>
            <option value="Legends">Legends</option>
            <option value="Fables">Fables</option>
            <option value="Fairy Tales">Fairy Tales</option>
          </select>
        </div>
      </div>
    </section>
  );
}
