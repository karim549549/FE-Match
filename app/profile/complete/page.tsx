"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginNavbar } from "@/components/auth/login/login-navbar";
import { LoginFooter } from "@/components/auth/login/login-footer";
import { CompleteProfileForm } from "@/components/profile/complete-profile-form";
import type {
  PersonalInfoFormData,
  PreferencesFormData,
} from "@/services/schema/profile-completion.validation.schema";
import type { LocationSelectionFormData } from "@/services/schema/location.validation.schema";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const onSubmit = useCallback(
    async (data: {
      avatar: string;
      personalInfo: PersonalInfoFormData;
      location: LocationSelectionFormData;
      preferences: PreferencesFormData;
    }) => {
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
        // TODO: Add profile completion API call here
        console.log("Profile completion:", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Complete loading
        setLoadingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Redirect to home/dashboard after profile completion
        router.push("/");
      } catch (error) {
        console.error("Profile completion error:", error);
        setLoadingProgress(0);
        // Handle error (show toast, etc.)
      } finally {
        clearInterval(progressInterval);
        setIsLoading(false);
        setLoadingProgress(0);
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full relative bg-background-dark font-display">
      <LoginNavbar />
      <div className="flex-1 w-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-x-hidden overflow-y-auto">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none cyber-grid"></div>
        <div className="relative w-full max-w-[600px] lg:max-w-[1400px] xl:max-w-[1600px] px-2 sm:px-0 py-8 lg:py-12">
          <CompleteProfileForm
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
      <LoginFooter />
    </div>
  );
}
