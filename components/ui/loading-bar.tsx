"use client";

import { motion } from "framer-motion";

interface LoadingBarProps {
  progress?: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function LoadingBar({
  progress = 0,
  label = "LOADING_ASSETS",
  showPercentage = true,
  className = "",
}: LoadingBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
          {label}
        </span>
        {showPercentage && (
          <span className="text-primary font-mono text-sm font-bold">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      <div className="relative w-full h-2 bg-[#1a1a1a] border border-gray-800 overflow-hidden">
        <motion.div
          className="relative h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Diagonal stripe pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.1) 20px
              )`,
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
