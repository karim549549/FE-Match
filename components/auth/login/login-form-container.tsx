"use client";

import { motion } from "framer-motion";
import { LoginForm } from "./login-form";
import type { LoginFormData } from "@/services/schema/login.validation.schema";

interface LoginFormContainerProps {
  isExpanded: boolean;
  isLoading: boolean;
  loadingProgress: number;
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginFormContainer({
  isExpanded,
  isLoading,
  loadingProgress,
  onSubmit,
}: LoginFormContainerProps) {
  return (
    <motion.div
      className="w-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-x-hidden"
      initial={{ width: "60%" }}
      animate={{ width: isExpanded ? "75%" : "60%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none lg:hidden cyber-grid"></div>
      <motion.div
        className="relative w-full max-w-[480px] px-2 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isExpanded ? 1 : 0.8,
          y: isExpanded ? 0 : 20,
        }}
        transition={{ duration: 0.8, delay: isExpanded ? 0.2 : 0 }}
      >
        <LoginForm
          isLoading={isLoading}
          loadingProgress={loadingProgress}
          onSubmit={onSubmit}
        />
        <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-white font-mono uppercase tracking-[0.2em]">
            Secure System v9.0 // Encrypted
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
