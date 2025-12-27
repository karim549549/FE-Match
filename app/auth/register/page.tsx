"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RegisterEmailFormData } from "@/services/schema/register.validation.schema";
import { RegisterBranding } from "@/components/auth/register/register-branding";
import { RegisterFormContainer } from "@/components/auth/register/register-form-container";

export default function RegisterPage() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Start animation after 2 seconds
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: RegisterEmailFormData) => {
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
      // TODO: Add registration logic here - send verification email
      console.log("Registration attempt:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete loading
      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect to OTP page for email verification with source parameter
      router.push("/auth/otp?from=register");
    } catch (error) {
      console.error("Registration error:", error);
      setLoadingProgress(0);
      // Handle error (show toast, etc.)
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="flex w-full max-w-full overflow-x-hidden min-w-0">
      <RegisterBranding isExpanded={isExpanded} />
      <RegisterFormContainer
        isExpanded={isExpanded}
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        onSubmit={onSubmit}
      />
    </div>
  );
}
