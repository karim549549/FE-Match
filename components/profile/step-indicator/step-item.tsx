"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { StepData } from "./step-data";

interface StepItemProps {
  step: StepData;
  currentStep: number;
  index: number;
  totalSteps: number;
}

// Memoized step item to prevent unnecessary re-renders
export const StepItem = memo(function StepItem({
  step,
  currentStep,
}: StepItemProps) {
  const isActive = currentStep === step.number;
  const isCompleted = currentStep > step.number;
  const distance = Math.abs(step.number - currentStep);

  // Memoize style calculations
  const stepStyle = useMemo(() => {
    const sizeScale =
      distance === 0 ? 1.0 : distance === 1 ? 0.9 : distance === 2 ? 0.75 : 0.6;
    const opacity =
      distance === 0
        ? 1.0
        : distance === 1
        ? 0.85
        : distance === 2
        ? 0.65
        : 0.5;
    const translateX =
      distance === 0 ? 48 : distance === 1 ? 24 : distance === 2 ? 12 : 0;
    const baseSize = 64;
    const size = baseSize * sizeScale;

    return {
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
      transform: `scale(${sizeScale}) translateX(${translateX}px)`,
      transition: "all 0.3s ease-out",
    };
  }, [distance]);

  const labelStyle = useMemo(() => {
    const opacity =
      distance === 0
        ? 1.0
        : distance === 1
        ? 0.85
        : distance === 2
        ? 0.65
        : 0.5;
    const fontSize =
      distance === 0
        ? 0.75
        : distance === 1
        ? 0.72
        : distance === 2
        ? 0.68
        : 0.64;
    const translateX =
      distance === 0 ? 48 : distance === 1 ? 24 : distance === 2 ? 12 : 0;

    return {
      opacity: opacity,
      fontSize: `${fontSize}rem`,
      transform: `translateX(${translateX}px)`,
      transition: "all 0.3s ease-out",
    };
  }, [distance]);

  // Memoize animation values
  const animateValues = useMemo(
    () => ({
      scale:
        distance === 0
          ? 1.0
          : distance === 1
          ? 0.9
          : distance === 2
          ? 0.75
          : 0.6,
      opacity:
        distance === 0
          ? 1.0
          : distance === 1
          ? 0.85
          : distance === 2
          ? 0.65
          : 0.5,
      x:
        distance === 0
          ? 48
          : distance === 1
          ? 24
          : distance === 2
          ? 12
          : 0,
    }),
    [distance]
  );

  return (
    <motion.div
      className="flex items-start gap-4"
      initial={false}
      animate={animateValues}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Step Number Circle */}
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full border-2 flex items-center justify-center font-mono font-bold transition-all ${
            isActive
              ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(255,0,128,0.5)]"
              : isCompleted
              ? "border-primary/50 bg-primary/20 text-primary"
              : "border-gray-700 bg-[#1a1a1a] text-gray-500"
          }`}
          style={stepStyle}
        >
          {isCompleted ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <span className="text-base font-bold">{step.number}</span>
          )}
        </div>
      </div>

      {/* Step Label */}
      <div className="flex-1 pt-2">
        <div
          className={`font-mono uppercase tracking-wider transition-all ${
            isActive
              ? "text-primary font-bold"
              : isCompleted
              ? "text-primary/70"
              : "text-gray-500"
          }`}
          style={labelStyle}
        >
          {step.label}
        </div>
      </div>
    </motion.div>
  );
});

