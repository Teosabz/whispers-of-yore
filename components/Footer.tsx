"use client";

import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="relative w-full border border-purple-700 rounded my-5 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/magic-book-bg.png')` }}
    >
      {/* Top Gradient Border */}
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 rounded"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-col md:flex-row lg:flex-row justify-between gap-10 text-white">
        {/* Logo & Tagline */}
        <div className="flex-1 text-center sm:text-center md:text-left lg:text-left">
          <h2 className="text-2xl font-extrabold tracking-wide text-purple-200">
            Whispers of Yore
          </h2>
          <p className="mt-3 text-sm text-purple-100">
            Discover the enchanting world of folktales, legends, and ancient
            stories that have been passed down through generations. Where every
            tale holds a whisper from the past.
          </p>
          <p className="mt-3 text-sm text-purple-200">
            Crafted with <span className="text-red-500">♥</span> by{" "}
            <span className="text-green-400 font-semibold">Matthew Sabeta</span>
          </p>
        </div>

        {/* Navigation / Explore */}
        <div className="flex-1 flex flex-col items-center sm:items-center md:items-start lg:items-start mt-6 md:mt-0">
          <h3 className="text-lg font-semibold text-purple-200">Explore</h3>
          <nav className="mt-3 flex flex-col gap-2 text-center md:text-left">
            <Link
              href="/"
              className="hover:text-yellow-400 transition duration-300 text-purple-100"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="hover:text-yellow-400 transition duration-300 text-purple-100"
            >
              Browse Tales
            </Link>
            <Link
              href="/submit"
              className="hover:text-yellow-400 transition duration-300 text-purple-100"
            >
              Share a Tale
            </Link>
          </nav>
        </div>

        {/* Socials */}
        <div className="flex-1 flex flex-col items-center sm:items-center md:items-end lg:items-end mt-6 md:mt-0">
          <h3 className="text-lg font-semibold text-purple-200">Follow Us</h3>
          <div className="mt-3 flex gap-5 text-2xl">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-100 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 transition duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="https://github.com/Teosabz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-100 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 transition duration-300"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/matthew-sabeta-a0aa04346/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-100 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 transition duration-300"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-purple-700 py-6 text-center text-sm text-purple-300 relative z-10">
        &copy; {new Date().getFullYear()} Matthew Sabeta. All rights reserved.
      </div>
    </footer>
  );
}
