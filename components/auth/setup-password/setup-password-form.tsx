"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import {
  setupPasswordSchema,
  type SetupPasswordFormData,
} from "@/services/schema/setup-password.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";

interface SetupPasswordFormProps {
  isLoading: boolean;
  loadingProgress: number;
  onSubmit: (data: SetupPasswordFormData) => Promise<void>;
}

export function SetupPasswordForm({
  isLoading,
  loadingProgress,
  onSubmit,
}: SetupPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordToggleRef = useRef<HTMLButtonElement>(null);
  const confirmPasswordToggleRef = useRef<HTMLButtonElement>(null);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
    mode: "onBlur",
  });

  const handleTogglePassword = (field: "password" | "confirmPassword") => {
    // Reduce score by 10 points
    reduceScore(10);

    // Show toast notification
    const ref =
      field === "password" ? passwordToggleRef : confirmPasswordToggleRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      } as MouseEvent;
      addToast(-10, fakeEvent);
    } else {
      addToast(-10);
    }

    // Toggle visibility
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-sm p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#ff0080]"></div>
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>

      <div className="mb-10 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight glitch-text"
          data-text="SETUP PASSCODE"
        >
          SETUP PASSCODE
        </h2>
        <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
          Create your secure sequence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-primary text-xs font-mono font-bold uppercase tracking-wider"
          >
            Passcode
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full bg-[#1a1a1a] border ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-800 focus:border-primary focus:ring-primary"
              } text-white font-mono text-sm rounded-sm py-4 pl-12 pr-12 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700`}
              placeholder="Enter secure sequence"
            />
            <button
              ref={passwordToggleRef}
              type="button"
              onClick={() => handleTogglePassword("password")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs font-mono mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-primary text-xs font-mono font-bold uppercase tracking-wider"
          >
            Confirm Passcode
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
              <LockIcon />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full bg-[#1a1a1a] border ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-800 focus:border-primary focus:ring-primary"
              } text-white font-mono text-sm rounded-sm py-4 pl-12 pr-12 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700`}
              placeholder="Re-enter secure sequence"
            />
            <button
              ref={confirmPasswordToggleRef}
              type="button"
              onClick={() => handleTogglePassword("confirmPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer focus:outline-none"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs font-mono mt-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        {isLoading ? (
          <div className="mt-8">
            <LoadingBar
              progress={loadingProgress}
              label="CREATING OPERATOR"
              showPercentage={true}
            />
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-sm text-white bg-primary hover:bg-[#d6006b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-900 transition-all duration-200 mt-8 shadow-[0_0_15px_rgba(255,0,128,0.4)] hover:shadow-[0_0_25px_rgba(255,0,128,0.6)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-mono tracking-widest text-base">
              COMPLETE REGISTRATION
            </span>
          </button>
        )}
      </form>
    </div>
  );
}
