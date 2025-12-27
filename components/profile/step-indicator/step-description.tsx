"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";
import type { StepData } from "./step-data";

interface StepDescriptionProps {
  step: StepData;
}

const BASE_RE_ENCRYPT_DELAY = 3000; // Base delay: 3 seconds
const MAX_RE_ENCRYPT_DELAY = 30000; // Max delay: 30 seconds

// Memoized description component to prevent unnecessary re-renders
export const StepDescription = memo(function StepDescription({
  step,
}: StepDescriptionProps) {
  // #region agent log
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
    const timestamp = Date.now();
    fetch('http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'step-description.tsx:18',message:'StepDescription render',data:{renderCount:renderCountRef.current,stepNumber:step.number,timestamp},timestamp,sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  });
  // #endregion

  const [isTranslated, setIsTranslated] = useState(false);
  const [translateCount, setTranslateCount] = useState(0);
  const translateRef = useRef<HTMLButtonElement>(null);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  // Reset translation when step changes
  // Using key prop on parent would be better, but this is acceptable for prop-driven reset
  // Note: This pattern is necessary to reset state when prop changes, and is acceptable here
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsTranslated(false);
    setTranslateCount(0);
  }, [step.number]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const handleTranslate = useCallback(() => {
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
    }
  }, [isTranslated, reduceScore, addToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8 pt-6 border-t border-primary/20"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <code
            className="text-xs font-mono tracking-wider"
            style={{ color: "rgba(255, 0, 128, 0.7)" }}
          >
            {isTranslated
              ? step.decryptedDescription
              : step.encryptedDescription}
          </code>
        </div>

        <button
          ref={translateRef}
          onClick={handleTranslate}
          className="text-xs font-mono px-3 py-1.5 rounded-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          style={{
            color: isTranslated
              ? "rgba(255, 0, 128, 0.5)"
              : "rgba(255, 0, 128, 0.5)",
            border: `1px solid ${
              isTranslated
                ? "rgba(255, 0, 128, 0.3)"
                : "rgba(255, 0, 128, 0.3)"
            }`,
          }}
          onMouseEnter={(e) => {
            if (!isTranslated) {
              e.currentTarget.style.color = "rgba(255, 0, 128, 0.8)";
              e.currentTarget.style.borderColor = "rgba(255, 0, 128, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isTranslated) {
              e.currentTarget.style.color = "rgba(255, 0, 128, 0.5)";
              e.currentTarget.style.borderColor = "rgba(255, 0, 128, 0.3)";
            }
          }}
          disabled={isTranslated}
        >
          {isTranslated ? "[DECRYPTED]" : "[TRANSLATE]"}
        </button>
      </div>
    </motion.div>
  );
});

