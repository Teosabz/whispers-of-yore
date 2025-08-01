// components/Header.tsx
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can handle search submit here,
    // e.g., navigate to a search page or update state
    alert(`Search for: ${searchQuery}`);
  };

  return (
    <header className="bg-yellow-600 text-yellow-100 px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Whispers of Yore
        </Link>

        <nav className="space-x-6 hidden md:flex">
          <Link href="/browse" className="hover:underline">
            Browse
          </Link>
          <Link href="/submit" className="hover:underline">
            Submit
          </Link>
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>
        </nav>

        <form onSubmit={handleSearchSubmit} className="ml-auto max-w-sm w-full">
          <input
            type="search"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-yellow-900"
            aria-label="Search stories"
          />
        </form>
      </div>
    </header>
  );
}
