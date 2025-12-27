"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import {
  otpSchema,
  type OtpFormData,
} from "@/services/schema/otp.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";

const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("from"); // "register" or "forgot-password"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeRemaining, setTimeRemaining] = useState(OTP_EXPIRY_TIME);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const resendRef = useRef<HTMLAnchorElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0 && !isExpired) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Update form value
    setValue("code", newOtp.join(""), { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      setValue("code", newOtp.join(""), { shouldValidate: true });
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setLoadingProgress(0);

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
      // TODO: Add OTP verification logic here
      console.log("OTP verification:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete loading
      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect based on source
      if (source === "register") {
        // Redirect to password setup page after OTP verification for registration
        router.push("/auth/setup-password");
      } else {
        // For forgot password, also redirect to setup password page to reset password
        router.push("/auth/setup-password?from=forgot-password");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleResendCode = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const action: ScoreAction = "RESEND_CODE";
    const points = getScoreValue(action);

    if (points < 0) {
      reduceScore(Math.abs(points));
    }

    if (resendRef.current) {
      const rect = resendRef.current.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      } as MouseEvent;
      addToast(points, fakeEvent);
    } else {
      addToast(points);
    }

    // TODO: Add resend OTP API call here
    console.log("Resending OTP code...");

    // Reset timer and OTP
    setTimeRemaining(OTP_EXPIRY_TIME);
    setIsExpired(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Don't redirect - just resend the code and stay on OTP page
    // The code will be resent via API call above
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

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/auth/forgot-password"
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
            <h2 className="text-lg font-mono text-white uppercase tracking-wider">
              VERIFY IDENTITY
            </h2>
            <Link
              href="/auth/login"
              className="text-xs font-mono text-gray-400 hover:text-gray-300 transition-colors cursor-pointer uppercase"
            >
              CANCEL
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-mono text-white mb-2 uppercase">
              ENTER ACCESS CODE
            </h1>
            <p className="text-sm font-mono text-gray-400">
              Secure transmission sent to your email address
            </p>
          </div>

          {/* OTP Input Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isExpired || isSubmitting}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-mono text-white bg-[#1a1a1a] border-2 rounded-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: digit
                      ? "rgba(255, 0, 128, 0.8)"
                      : "rgba(107, 114, 128, 0.5)",
                  }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="flex justify-center mb-4">
              <div
                className={`px-4 py-2 rounded-full border font-mono text-sm ${
                  isExpired
                    ? "border-red-500/50 text-red-400"
                    : "border-primary/50 text-primary"
                }`}
              >
                {isExpired ? "EXPIRED" : formatTime(timeRemaining)}
              </div>
            </div>

            {/* Status text */}
            <p className="text-center text-xs font-mono text-gray-500 mb-6">
              AWAITING DECRYPTION...
            </p>

            {/* Submit button */}
            {isLoading ? (
              <div className="space-y-2">
                <LoadingBar
                  progress={loadingProgress}
                  label="VERIFYING CODE"
                  showPercentage={true}
                />
              </div>
            ) : (
              <button
                type="submit"
                disabled={
                  otp.join("").length !== 6 || isExpired || isSubmitting
                }
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-mono text-sm uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,128,0.3)] hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                VERIFY CODE
              </button>
            )}
          </form>

          {/* Resend code link */}
          <div className="mt-6 text-center">
            <a
              ref={resendRef}
              href="/auth/forgot-password"
              onClick={handleResendCode}
              className="text-xs font-mono text-primary/70 hover:text-primary transition-colors cursor-pointer"
            >
              Resend Code
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
