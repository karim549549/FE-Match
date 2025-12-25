"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EmailIcon,
  ArrowLeftIcon,
  PlayIcon,
  ShieldKeyholeIcon,
} from "@/components/icons";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/services/schema/forgot-password.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";

const BASE_RE_ENCRYPT_DELAY = 3000;
const MAX_RE_ENCRYPT_DELAY = 30000;
const BASE_COOLDOWN_DELAY = 60000; // 1 minute base cooldown
const MAX_COOLDOWN_DELAY = 600000; // 10 minutes max cooldown

// Encrypted messages (Base64 encoded)
const ENCRYPTED_INSTRUCTIONS =
  "WU9VUiBSRUNPVkVSWSBQVUxTRSBXSUxMIEJFIFRSQU5TTUlUVEVEIFRPIFlPVVIgRU1BSUwgQUREUkVTUy4gRk9MTE9XIFRIRSBPUEVSQVRJT05BTCBJTlNUUlVDVElPTlMgVE8gQ09NUExFVEUgVEhFIE1JU1NJT04uIElGIFlPVSBERU5ZIFJFQ0VJVklORyBUSEUgUFVMTFNFLCBDSEVDSyBZT1VSIFNQQU0gRk9MREVSIC0gVEhFIEVORU1ZIE1BWSBIQVZFIElOVEVSQ0VQVEVEIFRIRSBUUkFOU01JU1NJT04u"; // "YOUR RECOVERY PULSE WILL BE TRANSMITTED TO YOUR EMAIL ADDRESS. FOLLOW THE OPERATIONAL INSTRUCTIONS TO COMPLETE THE MISSION. IF YOU DENY RECEIVING THE PULSE, CHECK YOUR SPAM FOLDER - THE ENEMY MAY HAVE INTERCEPTED THE TRANSMISSION."

const DECRYPTED_INSTRUCTIONS =
  "YOUR RECOVERY PULSE WILL BE TRANSMITTED TO YOUR EMAIL ADDRESS. FOLLOW THE OPERATIONAL INSTRUCTIONS TO COMPLETE THE MISSION. IF YOU DENY RECEIVING THE PULSE, CHECK YOUR SPAM FOLDER - THE ENEMY MAY HAVE INTERCEPTED THE TRANSMISSION.";

export function ForgotPasswordForm() {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translateCount, setTranslateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();
  const translateRef = useRef<HTMLButtonElement>(null);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  // Calculate exponential delay
  const getReEncryptDelay = useCallback(() => {
    const exponentialDelay =
      BASE_RE_ENCRYPT_DELAY * Math.pow(2, translateCount);
    return Math.min(exponentialDelay, MAX_RE_ENCRYPT_DELAY);
  }, [translateCount]);

  // Calculate exponential cooldown delay
  const getCooldownDelay = () => {
    const exponentialDelay = BASE_COOLDOWN_DELAY * Math.pow(2, sendCount);
    return Math.min(exponentialDelay, MAX_COOLDOWN_DELAY);
  };

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
  };

  // Cooldown timer effect
  useEffect(() => {
    if (isCooldown && cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1000) {
            setIsCooldown(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCooldown, cooldownTime]);

  const formatCooldownTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isCooldown) return;

    setIsLoading(true);
    setLoadingProgress(0);
    setIsSent(false);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // TODO: Add password recovery logic here
      console.log("Password recovery request:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete loading
      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Set sent status and start cooldown
      setIsSent(true);
      setSendCount((prev) => prev + 1);
      const cooldownDelay = getCooldownDelay();
      setIsCooldown(true);
      setCooldownTime(cooldownDelay);

      // Redirect to OTP page after a short delay
      setTimeout(() => {
        router.push("/auth/otp");
      }, 1500);
    } catch (error) {
      console.error("Password recovery error:", error);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      <motion.div
        className="relative w-full max-w-[480px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-sm p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#ff0080]"></div>
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>

          {/* Back button and logo */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/auth/login"
              className="flex items-center justify-center w-10 h-10 border border-primary/30 hover:border-primary/50 rounded-sm transition-all cursor-pointer group"
              style={{
                backgroundColor: "rgba(255, 0, 128, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 0, 128, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 0, 128, 0.05)";
              }}
            >
              <ArrowLeftIcon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary flex items-center justify-center">
                <PlayIcon className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-mono text-white">MATCH_SYS</span>
            </div>
          </div>

          {/* Shield with keyhole icon graphic */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-32 h-32 flex items-center justify-center relative">
                {/* Outer border with pixelated corners */}
                <div className="absolute inset-0 border border-primary/50 shadow-[0_0_20px_rgba(255,0,128,0.3)]">
                  {/* Top-left corner */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                  {/* Top-right corner */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                  {/* Bottom-left corner */}
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                  {/* Bottom-right corner */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                </div>
                {/* Shield with keyhole icon */}
                <ShieldKeyholeIcon className="h-20 w-20 relative z-10" />
              </div>
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-mono">
              <span className="text-white">Lost your </span>
              <span className="text-primary">Key?</span>
            </h1>
          </div>

          {/* Instruction text */}
          <p className="text-center text-sm font-mono text-gray-400 mb-8">
            Enter your registered email to receive a recovery pulse.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono text-primary/70 mb-2 uppercase tracking-wider"
              >
                TARGET EMAIL
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <EmailIcon className="h-5 w-5 text-primary/50" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="user@mainframe.net"
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-sm text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-mono text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            {isLoading ? (
              <div className="space-y-2">
                <LoadingBar
                  progress={loadingProgress}
                  label="TRANSMITTING PULSE"
                  showPercentage={true}
                />
              </div>
            ) : isSent && !isCooldown ? (
              <div className="w-full py-3 bg-green-500/20 border border-green-500/50 text-green-400 font-mono text-sm uppercase tracking-wider rounded-sm text-center">
                PULSE TRANSMITTED
              </div>
            ) : isCooldown ? (
              <div className="w-full py-3 bg-gray-800/50 border border-gray-700 text-gray-400 font-mono text-sm uppercase tracking-wider rounded-sm text-center">
                COOLDOWN ACTIVE: {formatCooldownTime(cooldownTime)}
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isCooldown}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-mono text-sm uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,128,0.3)] hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="h-4 w-4" />
                <span>SEND CODE</span>
              </button>
            )}
          </form>

          {/* Abort mission link */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-block px-4 py-2 text-xs font-mono text-gray-500 hover:text-gray-400 transition-colors cursor-pointer bg-[#1a1a1a] border border-gray-700 rounded-sm hover:border-gray-600"
            >
              ABORT MISSION
            </Link>
          </div>

          {/* Encrypted instructions */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="mb-3">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xs font-mono text-primary/50 flex-shrink-0 whitespace-nowrap">
                  {isTranslated ? "[ENCRYPTED]" : "[ENCRYPTED]"}
                </span>
                <code
                  className={`text-xs font-mono tracking-wider break-all overflow-wrap-anywhere ${
                    isTranslated ? "text-white/80" : "text-primary/70"
                  }`}
                >
                  {isTranslated
                    ? DECRYPTED_INSTRUCTIONS
                    : ENCRYPTED_INSTRUCTIONS}
                </code>
              </div>
            </div>

            <div className="flex justify-center">
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
                    e.currentTarget.style.borderColor =
                      "rgba(255, 0, 128, 0.5)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 0, 128, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isTranslated) {
                    e.currentTarget.style.color = "rgba(255, 0, 128, 0.5)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 0, 128, 0.3)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 0, 128, 0.05)";
                  }
                }}
                disabled={isTranslated}
              >
                {isTranslated ? "[DECRYPTED]" : "[TRANSLATE]"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
