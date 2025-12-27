"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";

interface RegisterBrandingProps {
  isExpanded: boolean;
}

const BASE_RE_ENCRYPT_DELAY = 60000; // 60 seconds base delay
const MAX_RE_ENCRYPT_DELAY = 300000; // 5 minutes max delay

// Encrypted bullet points (Base64 encoded)
const ENCRYPTED_BULLETS = [
  "U0NPUkUgU1lTVEVNIC0gR0xPQkFMIEdBTUVSIFNUQVRVUw==", // "SCORE SYSTEM - GLOBAL GAMER STATUS"
  "QUNUSU9OUyBJTkNSRUFTRSBPUiBERUNSRUFTRSBZT1VSIFNDT1JF", // "ACTIONS INCREASE OR DECREASE YOUR SCORE"
  "VE9PTFRJUFMgQU5EIE5PT0IgQUNUSU9OUyBSRURVQ0UgU0NPUkU=", // "TOOLTIPS AND NOOB ACTIONS REDUCE SCORE"
  "SElHSCBTQ09SRSBVTkxPQ0tTIFBSSVZJTEVHRVMgQU5EIFJFV0FSRFM=", // "HIGH SCORE UNLOCKS PRIVILEGES AND REWARDS"
  "Q0hBTExFTkdFIFlPVVJTRUxGIFRPIE1BSU5UQUlOIEVMSVRFIFNUQVRVUw==", // "CHALLENGE YOURSELF TO MAINTAIN ELITE STATUS"
];

const DECRYPTED_BULLETS = [
  "SCORE SYSTEM - GLOBAL GAMER STATUS",
  "ACTIONS INCREASE OR DECREASE YOUR SCORE",
  "TOOLTIPS AND NOOB ACTIONS REDUCE SCORE",
  "HIGH SCORE UNLOCKS PRIVILEGES AND REWARDS",
  "CHALLENGE YOURSELF TO MAINTAIN ELITE STATUS",
];

const TYPEWRITER_DELAY = 50; // ms per character
const BULLET_DELAY = 800; // ms between bullets

export function RegisterBranding({ isExpanded }: RegisterBrandingProps) {
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);
  const [currentBulletText, setCurrentBulletText] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [translateCount, setTranslateCount] = useState(0);
  const [justTranslated, setJustTranslated] = useState(false);
  const translateRef = useRef<HTMLButtonElement>(null);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  // Typewriter effect for bullets
  useEffect(() => {
    if (currentBulletIndex < ENCRYPTED_BULLETS.length) {
      const targetText = isTranslated
        ? DECRYPTED_BULLETS[currentBulletIndex]
        : ENCRYPTED_BULLETS[currentBulletIndex];

      // If we just translated mid-animation, adjust the current text proportionally once
      if (justTranslated && currentBulletText.length > 0) {
        const encryptedLength = ENCRYPTED_BULLETS[currentBulletIndex].length;
        const decryptedLength = DECRYPTED_BULLETS[currentBulletIndex].length;

        // Calculate proportional position in decrypted text based on encrypted progress
        if (
          encryptedLength > 0 &&
          decryptedLength > 0 &&
          encryptedLength !== decryptedLength
        ) {
          const progress = Math.min(
            currentBulletText.length / encryptedLength,
            1
          );
          const newLength = Math.max(1, Math.floor(decryptedLength * progress));

          // Adjust text to match proportional position in decrypted text
          // Use setTimeout to avoid setState in effect
          setTimeout(() => {
            setCurrentBulletText(targetText.slice(0, newLength));
            setJustTranslated(false);
          }, 0);
          return;
        }
        setTimeout(() => {
          setJustTranslated(false);
        }, 0);
      }

      if (currentBulletText.length < targetText.length) {
        const timer = setTimeout(() => {
          setCurrentBulletText(
            targetText.slice(0, currentBulletText.length + 1)
          );
        }, TYPEWRITER_DELAY);
        return () => clearTimeout(timer);
      } else {
        // Move to next bullet
        const timer = setTimeout(() => {
          if (currentBulletIndex < ENCRYPTED_BULLETS.length - 1) {
            setCurrentBulletIndex((prev) => prev + 1);
            setCurrentBulletText("");
          }
        }, BULLET_DELAY);
        return () => clearTimeout(timer);
      }
    }
  }, [currentBulletIndex, currentBulletText, isTranslated, justTranslated]);

  // Calculate exponential delay
  const getReEncryptDelay = useCallback(() => {
    const exponentialDelay =
      BASE_RE_ENCRYPT_DELAY * Math.pow(2, translateCount);
    return Math.min(exponentialDelay, MAX_RE_ENCRYPT_DELAY);
  }, [translateCount]);

  // Auto re-encrypt after exponential delay
  useEffect(() => {
    if (isTranslated) {
      const delay = getReEncryptDelay();
      const timer = setTimeout(() => {
        setIsTranslated(false);
        // Reset bullets when re-encrypting (but don't restart writing animation)
        // Just reset the text to show encrypted version
        const allBulletsComplete =
          currentBulletIndex >= ENCRYPTED_BULLETS.length - 1 &&
          currentBulletText.length >=
            ENCRYPTED_BULLETS[ENCRYPTED_BULLETS.length - 1]?.length;

        if (allBulletsComplete) {
          // All bullets are complete, just switch to encrypted text
          setCurrentBulletText(ENCRYPTED_BULLETS[ENCRYPTED_BULLETS.length - 1]);
        } else {
          // Reset to current state but encrypted
          setCurrentBulletText(ENCRYPTED_BULLETS[currentBulletIndex] || "");
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [
    isTranslated,
    translateCount,
    currentBulletIndex,
    currentBulletText,
    getReEncryptDelay,
  ]);

  const handleTranslate = () => {
    if (!isTranslated) {
      const action: ScoreAction = "TOOLTIP_USED";
      const points = getScoreValue(action);

      if (points < 0) {
        reduceScore(Math.abs(points));
      }

      if (translateRef.current) {
        const rect = translateRef.current.getBoundingClientRect();
        const fakeEvent = {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        } as MouseEvent;
        addToast(points, fakeEvent);
      } else {
        addToast(points);
      }

      setTranslateCount((prev) => prev + 1);
      setIsTranslated(true);
      setJustTranslated(true);
      // Don't reset the writing animation, just switch to decrypted text
      // The useEffect will handle updating the text to continue the animation with decrypted text
    }
  };

  return (
    <motion.div
      className="hidden lg:flex relative bg-background-dark border-r border-[#1a1a1a] flex-col items-center justify-center p-12 overflow-hidden"
      initial={{ width: "40%" }}
      animate={{ width: isExpanded ? "25%" : "40%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none cyber-grid"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40"></div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Logo and title */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-48 h-48 relative">
            <Image
              alt="MATCH Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,0,128,0.5)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDsmOVWeafLCgwagXWRtPhMVUXNx8qenIYua_soM5ianWhrKEeoa48C7dHU3oGb-txoHvvrXl0nObgeXxbhucMABgvx1x98BDoCqcX3_2ozrpxzbA-hZQpCY50AjrMrKgRb8RXRlri2kAGO59GeK6WfHDgebNr1aPLMKEfTBtkZkZP5fVDwo89RDX-LMK5OEkUCINye_zpKLLoU4BYMwoiVVkEFVsEo8iXqZOKL3JYR0n9aPVA3hR5p9FYUW4lZtaKAJUc_fQGSS22"
              width={192}
              height={192}
              unoptimized
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-white font-black tracking-tighter leading-none text-3xl">
              MATCH
            </h1>
            <p className="text-primary font-mono tracking-[0.2em] font-bold uppercase text-sm">
              The Realm of Loot.
            </p>
          </div>
        </div>

        {/* Score system bullets */}
        <div className="space-y-4 flex-1">
          {/* Display completed bullets */}
          {Array.from({ length: currentBulletIndex }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-primary font-mono text-base mt-1">•</span>
              <code className="text-sm font-mono text-white break-words">
                {isTranslated
                  ? DECRYPTED_BULLETS[index]
                  : ENCRYPTED_BULLETS[index]}
              </code>
            </div>
          ))}

          {/* Current bullet being written */}
          {currentBulletIndex < ENCRYPTED_BULLETS.length && (
            <div className="flex items-start gap-3">
              <span className="text-primary font-mono text-base mt-1">•</span>
              <code className="text-sm font-mono text-white break-words">
                {currentBulletText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="inline-block w-2 h-4 bg-primary ml-1"
                />
              </code>
            </div>
          )}

          {/* Translate button - appears from the start */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              ref={translateRef}
              onClick={handleTranslate}
              className="text-xs font-mono px-3 py-1.5 border rounded-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: isTranslated
                  ? "rgba(255, 0, 128, 0.5)"
                  : "rgba(255, 0, 128, 0.5)",
                borderColor: isTranslated
                  ? "rgba(255, 0, 128, 0.3)"
                  : "rgba(255, 0, 128, 0.3)",
                backgroundColor: "rgba(255, 0, 128, 0.05)",
              }}
              onMouseEnter={(e) => {
                if (!isTranslated) {
                  e.currentTarget.style.color = "rgba(255, 0, 128, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(255, 0, 128, 0.5)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 0, 128, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTranslated) {
                  e.currentTarget.style.color = "rgba(255, 0, 128, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(255, 0, 128, 0.3)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 0, 128, 0.05)";
                }
              }}
              disabled={isTranslated}
            >
              {isTranslated ? "[DECRYPTED]" : "[TRANSLATE]"}
            </button>
          </motion.div>
        </div>
      </div>

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
