"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SetupPasswordFormData } from "@/services/schema/setup-password.validation.schema";
import { SetupPasswordForm } from "@/components/auth/setup-password/setup-password-form";

export default function SetupPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const onSubmit = async (data: SetupPasswordFormData) => {
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
      // TODO: Add password setup logic here
      console.log("Password setup:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete loading
      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect to login or dashboard after successful registration
      router.push("/auth/login");
    } catch (error) {
      console.error("Password setup error:", error);
      setLoadingProgress(0);
      // Handle error (show toast, etc.)
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="flex w-full max-w-full overflow-x-hidden min-w-0 min-h-screen bg-background-dark">
      <div className="w-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-x-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none cyber-grid"></div>
        <div className="relative w-full max-w-[480px] px-2 sm:px-0">
          <SetupPasswordForm
            isLoading={isLoading}
            loadingProgress={loadingProgress}
            onSubmit={onSubmit}
          />
          <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-white font-mono uppercase tracking-[0.2em]">
              Secure System v9.0 // Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
