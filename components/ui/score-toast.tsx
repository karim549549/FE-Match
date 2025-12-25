"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreToastProps {
  points: number;
  onComplete: () => void;
}

function getColorForPoints(points: number): string {
  if (points < 0) {
    // Negative: pink for small, red for large
    const absPoints = Math.abs(points);
    if (absPoints <= 10) return "#ff0080"; // pink
    if (absPoints <= 25) return "#ff4444"; // light red
    if (absPoints <= 50) return "#ff6600"; // orange
    return "#ff0000"; // red
  } else {
    // Positive: yellow for small, green for large
    if (points <= 10) return "#ffd700"; // yellow
    if (points <= 25) return "#90ee90"; // light green
    if (points <= 50) return "#00ff00"; // green
    return "#00cc00"; // dark green
  }
}

export function ScoreToast({ points, onComplete }: ScoreToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const color = getColorForPoints(points);
  const isNegative = points < 0;
  const displayValue = isNegative ? points : `+${points}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none"
          style={{ color }}
        >
          <div className="font-mono text-2xl font-black drop-shadow-[0_0_10px_currentColor]">
            {displayValue}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
