// components/Header.tsx
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Search for: ${searchQuery}`);
  };

  return (
    <header className="bg-yellow-600 text-yellow-100 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left"
        >
          Whispers of Yore
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full sm:w-auto sm:ml-auto"
        >
          <input
            type="search"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 lg:w-80 rounded-md px-3 py-2 text-yellow-900 placeholder-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="Search stories"
          />
        </form>
      </div>
    </header>
  );
}
