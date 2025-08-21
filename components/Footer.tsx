"use client";

import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="relative w-full border border-purple-700 rounded my-5"
      style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
    >
      {/* Decorative Top Border */}
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold tracking-wide text-white">
            Whispers of Yore
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Tales carried through generations, retold for today.
          </p>
        </div>

        {/* Navigation / Explore */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-white">Explore</h3>
          <nav className="mt-3 flex flex-col gap-2">
            <Link
              href="/"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              Browse Tales
            </Link>

            <Link
              href="/submit"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              Share a Tale
            </Link>
          </nav>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="mt-3 flex gap-5 text-2xl">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="https://github.com/Teosabz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/matthew-sabeta-a0aa04346/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-purple-800 py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Matthew Sabeta. All rights reserved.
      </div>
    </footer>
  );
}
