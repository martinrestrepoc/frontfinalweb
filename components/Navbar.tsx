"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-md mx-auto my-4 shadow-md flex justify-center">
      <Link
        href="/"
        className="text-purple-300 text-2xl font-bold tracking-wide hover:text-purple-400 transition"
      >
        🏠 Arena Control
      </Link>
    </nav>
  );
}