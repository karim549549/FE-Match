"use client";

import { useCallback } from "react";

export function useScoreToast() {
  const addToast = useCallback((points: number, event?: MouseEvent) => {
    if (typeof window !== "undefined") {
      const addScoreToast = (
        window as Window & {
          __addScoreToast?: (points: number, event?: MouseEvent) => void;
        }
      ).__addScoreToast;
      if (addScoreToast) {
        addScoreToast(points, event);
      }
    }
  }, []);

  return { addToast };
}
