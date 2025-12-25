"use client";

import { useState, useCallback, useEffect } from "react";
import { ScoreToast } from "./score-toast";

interface Toast {
  id: string;
  points: number;
  x: number;
  y: number;
}

export function ScoreToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((points: number, event?: MouseEvent) => {
    const id = Math.random().toString(36).substring(7);
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    setToasts((prev) => [...prev, { id, points, x, y }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    // Expose addToast globally
    if (typeof window !== "undefined") {
      (
        window as Window & {
          __addScoreToast?: (points: number, event?: MouseEvent) => void;
        }
      ).__addScoreToast = addToast;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (
          window as Window & {
            __addScoreToast?: (points: number, event?: MouseEvent) => void;
          }
        ).__addScoreToast;
      }
    };
  }, [addToast]);

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${toast.x}px`,
            top: `${toast.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <ScoreToast
            points={toast.points}
            onComplete={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
