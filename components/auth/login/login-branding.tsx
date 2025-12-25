"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoginBrandingProps {
  isExpanded: boolean;
}

export function LoginBranding({ isExpanded }: LoginBrandingProps) {
  return (
    <motion.div
      className="hidden lg:flex relative bg-background-dark border-r border-[#1a1a1a] flex-col items-center justify-center p-12 overflow-hidden"
      initial={{ width: "40%" }}
      animate={{ width: isExpanded ? "25%" : "40%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none cyber-grid"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40"></div>
      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-8 max-w-lg"
        initial={{ scale: 0.7, opacity: 1 }}
        animate={{
          scale: isExpanded ? 0.65 : 0.7,
          opacity: isExpanded ? 0.7 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative mb-4"
          animate={{ scale: isExpanded ? 0.65 : 0.7 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            alt="MATCH Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,0,128,0.5)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDsmOVWeafLCgwagXWRtPhMVUXNx8qenIYua_soM5ianWhrKEeoa48C7dHU3oGb-txoHvvrXl0nObgeXxbhucMABgvx1x98BDoCqcX3_2ozrpxzbA-hZQpCY50AjrMrKgRb8RXRlri2kAGO59GeK6WfHDgebNr1aPLMKEfTBtkZkZP5fVDwo89RDX-LMK5OEkUCINye_zpKLLoU4BYMwoiVVkEFVsEo8iXqZOKL3JYR0n9aPVA3hR5p9FYUW4lZtaKAJUc_fQGSS22"
            width={256}
            height={256}
            unoptimized
          />
        </motion.div>
        <div className="space-y-2">
          <motion.h1
            className="text-white font-black tracking-tighter leading-none whitespace-nowrap text-2xl sm:text-3xl md:text-4xl"
            animate={{ fontSize: isExpanded ? "clamp(1.5rem, 2.5vw, 2.5rem)" : "clamp(1.25rem, 2vw, 2rem)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            MATCH
          </motion.h1>
          <motion.p
            className="text-primary font-mono tracking-[0.2em] font-bold uppercase whitespace-nowrap text-xs sm:text-sm"
            animate={{ fontSize: isExpanded ? "clamp(0.75rem, 1vw, 1rem)" : "clamp(0.625rem, 0.875vw, 0.875rem)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            The Realm of Loot.
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-10 font-mono text-xs text-gray-600 flex gap-4"
        animate={{ opacity: isExpanded ? 0.5 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <span>SYS.VER.2.0.4</span>
        <span>{/* SECURE_CONNECTION */}</span>
      </motion.div>
    </motion.div>
  );
}
