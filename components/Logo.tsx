"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-3xl sm:text-4xl font-magic-logo bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent select-none"
    >
      Whispers of Yore
    </Link>
  );
}
