"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";

/**
 * Encrypted messages (Base64 encoded)
 */
const ENCRYPTED_MESSAGE = "Rk9SIFNVUFBPUlQ="; // "FOR SUPPORT"
const ENCRYPTED_LINK = "UkVRVUVTVF9BU1NJU1RBTkNF"; // "REQUEST_ASSISTANCE"
const ENCRYPTED_LABEL = "W0VOQ1JZUFRFRF0="; // "[ENCRYPTED]"

/**
 * Decrypted versions
 */
const DECRYPTED_MESSAGE = "FOR SUPPORT";
const DECRYPTED_LINK = "REQUEST_ASSISTANCE";
const DECRYPTED_LABEL = "[ENCRYPTED]";

const BASE_RE_ENCRYPT_DELAY = 3000; // Base delay: 3 seconds
const MAX_RE_ENCRYPT_DELAY = 30000; // Max delay: 30 seconds

export function LoginFooter() {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translateCount, setTranslateCount] = useState(0);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  // Calculate exponential delay: 3s, 6s, 12s, 24s, 30s (capped)
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
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isTranslated, translateCount, getReEncryptDelay]);

  const handleTranslate = () => {
    if (!isTranslated) {
      // User is a noob for using translate
      const action: ScoreAction = "TOOLTIP_USED";
      const points = getScoreValue(action);

      if (points < 0) {
        reduceScore(Math.abs(points));
      }

      // Show toast at button position
      const button = document.getElementById("translate-btn");
      if (button) {
        const rect = button.getBoundingClientRect();
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
    }
  };

  return (
    <footer
      className="w-full p-4 md:p-6 bg-background-dark/50 backdrop-blur-sm flex-shrink-0"
      style={{ borderTop: "1px solid rgba(0, 255, 255, 0.2)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(0, 255, 255, 0.5)" }}
          >
            {isTranslated ? DECRYPTED_LABEL : ENCRYPTED_LABEL}
          </span>
          <code
            className="text-xs font-mono tracking-wider"
            style={{ color: "rgba(0, 255, 255, 0.7)" }}
          >
            {isTranslated ? DECRYPTED_MESSAGE : ENCRYPTED_MESSAGE}
          </code>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(0, 255, 255, 0.3)" }}
          >
            {/* 0x46 0x4F 0x52 */}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="translate-btn"
            onClick={handleTranslate}
            className="text-xs font-mono px-3 py-1.5 rounded-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: isTranslated
                ? "rgba(0, 255, 255, 0.5)"
                : "rgba(0, 255, 255, 0.5)",
              border: `1px solid ${
                isTranslated
                  ? "rgba(0, 255, 255, 0.3)"
                  : "rgba(0, 255, 255, 0.3)"
              }`,
            }}
            onMouseEnter={(e) => {
              if (!isTranslated) {
                e.currentTarget.style.color = "rgba(0, 255, 255, 0.8)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isTranslated) {
                e.currentTarget.style.color = "rgba(0, 255, 255, 0.5)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.3)";
              }
            }}
            disabled={isTranslated}
          >
            {isTranslated ? "[DECRYPTED]" : "[TRANSLATE]"}
          </button>

          <Link
            href="/support"
            className="text-xs font-mono underline underline-offset-4 transition-all cursor-pointer flex items-center gap-2 group"
            style={{
              color: "rgba(0, 255, 255, 0.6)",
              textDecorationColor: "rgba(0, 255, 255, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(0, 255, 255, 1)";
              e.currentTarget.style.textDecorationColor =
                "rgba(0, 255, 255, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(0, 255, 255, 0.6)";
              e.currentTarget.style.textDecorationColor =
                "rgba(0, 255, 255, 0.4)";
            }}
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              &lt;{isTranslated ? DECRYPTED_LINK : ENCRYPTED_LINK} /&gt;
            </span>
            <span
              className="transition-colors"
              style={{ color: "rgba(0, 255, 255, 0.4)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(0, 255, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0, 255, 255, 0.4)";
              }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
