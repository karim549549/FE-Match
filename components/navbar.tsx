"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useScoreStore } from "@/stores/score-store";

export interface User {
  name: string;
  email: string;
  image?: string;
}

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user = null }: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use lazy initialization to avoid setState in effect
  const [guestId] = useState<string>(() => {
    if (typeof window === "undefined" || !!user) return "";
    const storedGuestId = localStorage.getItem("guestId");
    if (storedGuestId) {
      return storedGuestId;
    }
    // Generate a unique guest ID (e.g., GUEST-XXXXX)
    const newGuestId = `GUEST-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;
    localStorage.setItem("guestId", newGuestId);
    return newGuestId;
  });
  const score = useScoreStore((state) => state.score);
  const isLoggedIn = !!user;

  const navigationItems = [
    { label: "TRADE", subtitle: "MARKETPLACE", href: "#" },
    { label: "EXPLORE", subtitle: "DISCOVER", href: "#" },
    { label: "VAULT", subtitle: "STORAGE", href: "#", badge: "12181/10009911" },
    { label: "COMMUNITY", subtitle: "SOCIAL", href: "#" },
  ];

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (isLoggedIn) {
      // TODO: Add logout logic here (clear session, etc.)
      console.log("Logout clicked");
      // After logout, redirect to login
      router.push("/auth/login");
    } else {
      // Redirect to login page if not logged in
      router.push("/auth/login");
    }
  };

  const handleSettings = () => {
    setIsMenuOpen(false);
    // TODO: Add settings navigation logic here
    console.log("Settings clicked");
  };

  return (
    <header className="relative z-20 flex items-center justify-between p-6 md:p-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary"></div>
        <span className="text-white font-mono text-sm md:text-base">
          PINK SWORDS
        </span>
      </div>

      {/* Burger Menu Button - Visible on small screens, hidden on lg+ */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden relative z-30 flex flex-col items-center justify-center w-10 h-10 gap-1.5 group cursor-pointer"
        aria-label="Toggle menu"
      >
        <motion.span
          className="w-6 h-0.5 bg-primary transition-all"
          animate={{
            rotate: isMenuOpen ? 45 : 0,
            y: isMenuOpen ? 8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-primary transition-all"
          animate={{
            opacity: isMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-primary transition-all"
          animate={{
            rotate: isMenuOpen ? -45 : 0,
            y: isMenuOpen ? -8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 border-l border-primary/30 z-30 lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-20 space-y-6">
                {/* User Profile Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 pb-4"
                >
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    {isLoggedIn && user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full border-2 border-primary object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full border-2 border-primary/50 bg-black/50 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-primary/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-white font-mono text-sm font-semibold truncate">
                        {isLoggedIn ? user.name : `Guest ${guestId}`}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/20 border border-primary/30 rounded">
                        <svg
                          className="w-3.5 h-3.5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-primary font-mono text-xs font-semibold">
                          {score.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-white/60 font-mono text-xs truncate">
                      {isLoggedIn ? user.email : "guest@match.com"}
                    </div>
                  </div>
                </motion.div>

                {/* Separator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                />

                {/* Navigation Items */}
                <div className="space-y-3">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        // Add navigation logic here
                      }}
                      className="w-full group cursor-pointer"
                    >
                      <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)] text-left">
                        {item.badge && (
                          <div className="text-white/50 font-mono text-xs mb-2 group-hover:text-white transition-colors">
                            {item.badge}
                          </div>
                        )}
                        <div className="text-primary font-mono text-xs uppercase mb-1">
                          {item.label}
                        </div>
                        <div className="text-white font-mono text-sm">
                          {item.subtitle}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Separator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                />

                {/* Settings and Logout Buttons */}
                <div className="space-y-3 pt-2">
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleSettings}
                    className="w-full group cursor-pointer"
                  >
                    <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)] text-left flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-white font-mono text-sm">
                        SETTINGS
                      </span>
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleLogout}
                    className="w-full group cursor-pointer"
                  >
                    <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)] text-left flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-white font-mono text-sm">
                        {isLoggedIn ? "LOG OUT" : "LOG IN"}
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
