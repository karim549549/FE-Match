"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { EmailIcon } from "@/components/icons";
import {
  registerEmailSchema,
  type RegisterEmailFormData,
} from "@/services/schema/register.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import { SocialLoginButtons } from "../login/social-login-buttons";

interface RegisterFormProps {
  isLoading: boolean;
  loadingProgress: number;
  onSubmit: (data: RegisterEmailFormData) => Promise<void>;
}

export function RegisterForm({
  isLoading,
  loadingProgress,
  onSubmit,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterEmailFormData>({
    resolver: zodResolver(registerEmailSchema),
    mode: "onBlur",
  });

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
          data-text="CREATE OPERATOR"
        >
          CREATE OPERATOR
        </h2>
        <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
          Begin your journey in the realm
        </p>
      </div>

      <SocialLoginButtons />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
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

        {isLoading ? (
          <div className="mt-8">
            <LoadingBar
              progress={loadingProgress}
              label="SENDING VERIFICATION"
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
              SEND VERIFICATION EMAIL
            </span>
          </button>
        )}
      </form>

      <div className="mt-8 text-center">
        <a
          className="text-sm font-mono text-primary/70 hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer"
          href="/auth/login"
        >
          &lt;Already have an account? /&gt;
        </a>
      </div>
    </div>
  );
}
