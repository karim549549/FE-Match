"use client";

import { useState, useEffect } from "react";
import type { LoginFormData } from "@/services/schema/login.validation.schema";
import { LoginBranding } from "@/components/auth/login/login-branding";
import { LoginFormContainer } from "@/components/auth/login/login-form-container";

export default function LoginPage() {
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

  const onSubmit = async (data: LoginFormData) => {
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
      // TODO: Add authentication logic here
      console.log("Login attempt:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete loading
      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // await login(data.email, data.password);
      // router.push('/dashboard'); // Uncomment when ready
    } catch (error) {
      console.error("Login error:", error);
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
      <LoginBranding isExpanded={isExpanded} />
      <LoginFormContainer
        isExpanded={isExpanded}
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        onSubmit={onSubmit}
      />
    </div>
  );
}
