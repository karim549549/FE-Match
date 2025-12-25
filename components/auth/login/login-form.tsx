"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { EmailIcon, LockIcon, LoginIcon } from "@/components/icons";
import {
  loginSchema,
  type LoginFormData,
} from "@/services/schema/login.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScoreStore } from "@/stores/score-store";
import { useScoreToast } from "@/hooks/use-score-toast";
import { getScoreValue, type ScoreAction } from "@/constants/score-actions";
import { SocialLoginButtons } from "./social-login-buttons";

interface LoginFormProps {
  isLoading: boolean;
  loadingProgress: number;
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginForm({
  isLoading,
  loadingProgress,
  onSubmit,
}: LoginFormProps) {
  const recoverIdentityRef = useRef<HTMLAnchorElement>(null);
  const createOperatorRef = useRef<HTMLAnchorElement>(null);
  const reduceScore = useScoreStore((state) => state.reduceScore);
  const { addToast } = useScoreToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const handleTooltipOpen = (
    action: ScoreAction,
    ref: React.RefObject<HTMLAnchorElement | null>
  ) => {
    const points = getScoreValue(action);

    if (points < 0) {
      reduceScore(Math.abs(points));
    } else if (points > 0) {
      const increaseScore = useScoreStore.getState().increaseScore;
      increaseScore(points);
    }

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      } as MouseEvent;
      addToast(points, fakeEvent);
    } else {
      addToast(points);
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
          data-text="ACCESS GRANTED"
        >
          ACCESS GRANTED
        </h2>
        <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
          Identify yourself operator
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-primary text-xs font-mono font-bold uppercase tracking-wider"
          >
            Operator ID // Email
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
              <EmailIcon />
            </span>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full bg-[#1a1a1a] border ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-800 focus:border-primary focus:ring-primary"
              } text-white font-mono text-sm rounded-sm py-4 pl-12 pr-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700`}
              placeholder="Enter identification string"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs font-mono mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>
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
              type="password"
              {...register("password")}
              className={`w-full bg-[#1a1a1a] border ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-800 focus:border-primary focus:ring-primary"
              } text-white font-mono text-sm rounded-sm py-4 pl-12 pr-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700`}
              placeholder="Enter secure sequence"
            />
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
        {isLoading ? (
          <div className="mt-8">
            <LoadingBar
              progress={loadingProgress}
              label="AUTHENTICATING"
              showPercentage={true}
            />
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-sm text-white bg-primary hover:bg-[#d6006b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-900 transition-all duration-200 mt-8 shadow-[0_0_15px_rgba(255,0,128,0.4)] hover:shadow-[0_0_25px_rgba(255,0,128,0.6)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoginIcon className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" />
            </span>
            <span className="font-mono tracking-widest text-base">
              INITIALIZE LOGIN
            </span>
          </button>
        )}
      </form>

      <SocialLoginButtons />

      <div className="mt-8 text-center space-y-3">
        <div>
          <Tooltip
            delayDuration={2000}
            onOpenChange={(open) => {
              if (open) {
                handleTooltipOpen("TOOLTIP_USED", recoverIdentityRef);
              }
            }}
          >
            <TooltipTrigger asChild>
              <a
                ref={recoverIdentityRef}
                className="text-sm font-mono text-primary/70 hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer"
                href="/auth/forgot-password"
              >
                &lt;Recover Identity /&gt;
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Forget password (noob) 🤦‍♂️</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip
            delayDuration={2000}
            onOpenChange={(open) => {
              if (open) {
                handleTooltipOpen("TOOLTIP_USED", createOperatorRef);
              }
            }}
          >
            <TooltipTrigger asChild>
              <a
                ref={createOperatorRef}
                className="text-sm font-mono text-primary/70 hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer"
                href="/auth/register"
              >
                &lt;Create Operator /&gt;
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign up (noob) 🎮</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
