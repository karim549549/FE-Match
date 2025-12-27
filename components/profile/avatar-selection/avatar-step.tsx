"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { type UseFormReturn } from "react-hook-form";
import { AvatarSelector } from "./avatar-selector";
import type { AvatarFormData } from "@/services/schema/avatar.validation.schema";

interface AvatarStepProps {
  form: UseFormReturn<AvatarFormData>;
}

export const AvatarStep = memo(function AvatarStep({ form }: AvatarStepProps) {
  // #region agent log
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  fetch('http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'avatar-step.tsx:11',message:'AvatarStep render',data:{renderCount:renderCountRef.current,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  const {
    getValues,
    setValue,
    formState,
  } = form;

  // #region agent log
  const errorsRef = useRef(formState.errors);
  const errorsChanged = errorsRef.current !== formState.errors;
  if (errorsChanged) {
    errorsRef.current = formState.errors;
    fetch('http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'avatar-step.tsx:21',message:'formState.errors changed',data:{hasErrors:!!formState.errors.avatar,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
  }
  const errors = formState.errors;
  // #endregion

  // Use local state instead of watch() to prevent re-renders
  // Initialize from form, but don't sync - form will be reset by parent when navigating back
  const formInitialValue = getValues("avatar") || "";
  const [avatarValue, setAvatarValue] = useState<string>(formInitialValue);
  
  // Only sync once on mount if form has a value we don't have
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'avatar-step.tsx:24',message:'AvatarStep useEffect mount',data:{formValue:getValues("avatar")||"",localValue:avatarValue,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const currentFormValue = getValues("avatar") || "";
    if (currentFormValue && currentFormValue !== avatarValue) {
      setAvatarValue(currentFormValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleChange = (avatar: string) => {
    setAvatarValue(avatar);
    setValue("avatar", avatar, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-primary font-mono text-lg uppercase tracking-wider mb-2">
          SELECT OPERATOR AVATAR
        </h3>
        <p className="text-white/60 font-mono text-xs uppercase tracking-wider">
          Choose your visual identity
        </p>
      </div>

      <AvatarSelector
        value={avatarValue}
        onChange={handleChange}
        error={errors.avatar?.message}
      />
    </motion.div>
  );
});

