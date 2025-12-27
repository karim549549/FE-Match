"use client";

import Link from "next/link";
import { TwitterIcon, DiscordIcon, InstagramIcon } from "@/components/icons";

export function LoginNavbar() {
  return (
    <nav className="w-full p-4 md:p-6 bg-background-dark/50 backdrop-blur-sm border-b border-gray-800 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex justify-end">
        <div className="flex items-center gap-3">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 border border-gray-700 bg-[#1a1a1a] hover:bg-[#252525] hover:border-gray-500 rounded-sm transition-all cursor-pointer group"
          >
            <TwitterIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 border border-gray-700 bg-[#1a1a1a] hover:bg-[#252525] hover:border-gray-500 rounded-sm transition-all cursor-pointer group"
          >
            <DiscordIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 border border-gray-700 bg-[#1a1a1a] hover:bg-[#252525] hover:border-gray-500 rounded-sm transition-all cursor-pointer group"
          >
            <InstagramIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
