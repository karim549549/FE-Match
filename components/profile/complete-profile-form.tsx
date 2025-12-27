"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  personalInfoSchema,
  preferencesSchema,
  type PersonalInfoFormData,
  type PreferencesFormData,
} from "@/services/schema/profile-completion.validation.schema";
import {
  locationSelectionSchema,
  type LocationSelectionFormData,
} from "@/services/schema/location.validation.schema";
import {
  avatarSchema,
  type AvatarFormData,
} from "@/services/schema/avatar.validation.schema";
import { LoadingBar } from "@/components/ui/loading-bar";
import { VerticalStepIndicator } from "./step-indicator/vertical-step-indicator";
import { LocationMapStep } from "./location-selection/location-map-step";
import { AvatarStep } from "./avatar-selection/avatar-step";

interface CompleteProfileFormProps {
  isLoading: boolean;
  loadingProgress: number;
  onSubmit: (data: {
    avatar: string;
    personalInfo: PersonalInfoFormData;
    location: LocationSelectionFormData;
    preferences: PreferencesFormData;
  }) => Promise<void>;
}

const TOTAL_STEPS = 5;

export function CompleteProfileForm({
  isLoading,
  loadingProgress,
  onSubmit,
}: CompleteProfileFormProps) {
  // #region agent log
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
    const timestamp = Date.now();
    fetch("http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "complete-profile-form.tsx:44",
        message: "CompleteProfileForm render",
        data: { renderCount: renderCountRef.current, timestamp },
        timestamp,
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
  });
  // #endregion

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    avatar?: string;
    personalInfo?: PersonalInfoFormData;
    location?: LocationSelectionFormData;
    preferences?: PreferencesFormData;
  }>({});

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "complete-profile-form.tsx:52",
        message: "currentStep changed",
        data: { currentStep, timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
  }, [currentStep]);
  // #endregion

  // REMOVED: formData useEffect - this was causing continuous re-renders
  // The formData object reference changes on every setFormData call,
  // causing this effect to run and trigger re-renders

  // Step 1: Avatar Selection Form
  // #region agent log
  const [avatarFormInstanceId] = useState(() =>
    Math.random().toString(36).substring(7)
  );
  useEffect(() => {
    const timestamp = Date.now();
    fetch("http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "complete-profile-form.tsx:113",
        message: "avatarForm about to create",
        data: {
          instanceId: avatarFormInstanceId,
          renderCount: renderCountRef.current,
          timestamp,
        },
        timestamp,
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
  }, [avatarFormInstanceId]);
  // #endregion
  const avatarForm = useForm<AvatarFormData>({
    resolver: zodResolver(avatarSchema),
    mode: "onBlur",
    defaultValues: {},
  });

  // Step 2: Personal Info Form
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: {},
  });

  // Step 3: Location Selection Form
  const locationForm = useForm<LocationSelectionFormData>({
    resolver: zodResolver(locationSelectionSchema),
    mode: "onBlur",
    defaultValues: {},
  });

  // Step 4: Preferences Form
  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    mode: "onBlur",
    defaultValues: {
      interests: [],
      language: "",
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
    },
  });

  // Use ref to track the last step we reset to prevent unnecessary resets
  const lastResetStepRef = useRef<number>(0);
  // Use ref to access formData without creating dependency on object reference
  const formDataRef = useRef(formData);

  // Update ref in effect to avoid updating during render
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Only reset forms when navigating BACK to a step (not forward)
  // This prevents unnecessary re-renders
  useEffect(() => {
    const timestamp = Date.now();
    fetch("http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "complete-profile-form.tsx:93",
        message: "form reset useEffect executed",
        data: {
          currentStep,
          lastStep: lastResetStepRef.current,
          isGoingBack: currentStep < lastResetStepRef.current,
          timestamp,
        },
        timestamp,
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    // Only reset if we're going back to a step that has saved data
    // Use formDataRef.current to avoid dependency on formData object reference
    if (currentStep < lastResetStepRef.current) {
      if (formDataRef.current.avatar && currentStep === 1) {
        const timestamp = Date.now();
        fetch(
          "http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "complete-profile-form.tsx:97",
              message: "resetting avatarForm",
              data: { timestamp },
              timestamp,
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "B",
            }),
          }
        ).catch(() => {});
        // #endregion
        avatarForm.reset({ avatar: formDataRef.current.avatar });
      } else if (formDataRef.current.personalInfo && currentStep === 2) {
        const timestamp = Date.now();
        fetch(
          "http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "complete-profile-form.tsx:99",
              message: "resetting personalInfoForm",
              data: { timestamp },
              timestamp,
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "B",
            }),
          }
        ).catch(() => {});
        // #endregion
        personalInfoForm.reset(formDataRef.current.personalInfo);
      } else if (formDataRef.current.location && currentStep === 3) {
        const timestamp = Date.now();
        fetch(
          "http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "complete-profile-form.tsx:101",
              message: "resetting locationForm",
              data: { timestamp },
              timestamp,
              sessionId: "debug-session",
              runId: "post-fix",
              hypothesisId: "B",
            }),
          }
        ).catch(() => {});
        // #endregion
        locationForm.reset(formDataRef.current.location);
      } else if (formDataRef.current.preferences && currentStep === 4) {
        const timestamp = Date.now();
        fetch(
          "http://127.0.0.1:7243/ingest/9a087d4e-6bfd-4d13-a739-a08596b9376a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "complete-profile-form.tsx:103",
              message: "resetting preferencesForm",
              data: { timestamp },
              timestamp,
              sessionId: "debug-session",
              runId: "post-fix",
              hypothesisId: "B",
            }),
          }
        ).catch(() => {});
        // #endregion
        preferencesForm.reset(formDataRef.current.preferences);
      }
    }
    lastResetStepRef.current = currentStep;
  }, [
    currentStep,
    avatarForm,
    locationForm,
    personalInfoForm,
    preferencesForm,
  ]); // Include form dependencies

  const handleNext = useCallback(async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await avatarForm.trigger();
      if (isValid) {
        const avatarData = avatarForm.getValues().avatar;
        setFormData((prev) => ({ ...prev, avatar: avatarData }));
      }
    } else if (currentStep === 2) {
      isValid = await personalInfoForm.trigger();
      if (isValid) {
        const personalInfoData = personalInfoForm.getValues();
        setFormData((prev) => ({ ...prev, personalInfo: personalInfoData }));
      }
    } else if (currentStep === 3) {
      isValid = await locationForm.trigger();
      if (isValid) {
        const locationData = locationForm.getValues();
        setFormData((prev) => ({ ...prev, location: locationData }));
      }
    } else if (currentStep === 4) {
      isValid = await preferencesForm.trigger();
      if (isValid) {
        const preferencesData = preferencesForm.getValues();
        setFormData((prev) => ({ ...prev, preferences: preferencesData }));
      }
    } else if (currentStep === 5) {
      // Placeholder step - always valid
      isValid = true;
    }

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else if (isValid && currentStep === TOTAL_STEPS) {
      // Submit all data - use formDataRef to get latest value
      await onSubmit({
        avatar: formDataRef.current.avatar!,
        personalInfo: formDataRef.current.personalInfo!,
        location: formDataRef.current.location!,
        preferences: formDataRef.current.preferences!,
      });
    }
  }, [
    currentStep,
    avatarForm,
    personalInfoForm,
    locationForm,
    preferencesForm,
    onSubmit,
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return (
    <div className="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-sm p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#ff0080]"></div>
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>

      {/* Progress Bar - Hidden on large screens */}
      <div className="mb-8 lg:hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary font-mono text-xs uppercase tracking-wider">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-white/50 font-mono text-xs">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Split Layout for Large Screens - 1:2 ratio */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Section - Vertical Step Indicator (1/3 of width) */}
        <div className="hidden lg:block lg:col-span-1">
          <VerticalStepIndicator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        </div>

        {/* Right Section - Form Content (2/3 of width) */}
        <div className="lg:col-span-2">
          <div className="mb-10 text-center lg:text-left">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight glitch-text"
              data-text="COMPLETE PROFILE"
            >
              COMPLETE PROFILE
            </h2>
            <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
              {currentStep === 1 && "Avatar Selection"}
              {currentStep === 2 && "Personal Information"}
              {currentStep === 3 && "Location Selection"}
              {currentStep === 4 && "Preferences & Settings"}
              {currentStep === 5 && "Additional Step 5"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <AvatarStep key={`step1-${currentStep}`} form={avatarForm} />
            )}
            {currentStep === 2 && (
              <PersonalInfoStep
                key={`step2-${currentStep}`}
                form={personalInfoForm}
              />
            )}
            {currentStep === 3 && (
              <LocationMapStep
                key={`step3-${currentStep}`}
                form={locationForm}
              />
            )}
            {currentStep === 4 && (
              <PreferencesStep
                key={`step4-${currentStep}`}
                form={preferencesForm}
              />
            )}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-white font-mono">Step 5 Placeholder</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {isLoading ? (
            <div className="mt-8">
              <LoadingBar
                progress={loadingProgress}
                label="SAVING PROFILE"
                showPercentage={true}
              />
            </div>
          ) : (
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-4 px-4 border border-gray-700 text-white font-mono text-sm rounded-sm hover:border-primary transition-all cursor-pointer"
                >
                  BACK
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-4 px-4 border border-transparent text-white bg-primary hover:bg-[#d6006b] font-mono text-sm font-bold rounded-sm transition-all shadow-[0_0_15px_rgba(255,0,128,0.4)] hover:shadow-[0_0_25px_rgba(255,0,128,0.6)] cursor-pointer"
              >
                {currentStep === TOTAL_STEPS ? "COMPLETE" : "NEXT"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 2: Personal Information
function PersonalInfoStep({
  form,
}: {
  form: UseFormReturn<PersonalInfoFormData>;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Personal Info Fields - Grid Layout on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
            First Name
          </label>
          <input
            {...register("firstName")}
            className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700"
            placeholder="Enter first name"
          />
          <div className="min-h-[20px]">
            {errors.firstName && (
              <p
                className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
                style={{
                  textShadow:
                    "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
                }}
              >
                ⚠ {errors.firstName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
            Last Name
          </label>
          <input
            {...register("lastName")}
            className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700"
            placeholder="Enter last name"
          />
          <div className="min-h-[20px]">
            {errors.lastName && (
              <p
                className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
                style={{
                  textShadow:
                    "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
                }}
              >
                ⚠ {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
            Display Name
          </label>
          <input
            {...register("displayName")}
            className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700"
            placeholder="Enter display name"
          />
          <div className="min-h-[20px]">
            {errors.displayName && (
              <p
                className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
                style={{
                  textShadow:
                    "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
                }}
              >
                ⚠ {errors.displayName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
            Date of Birth
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all"
          />
          <div className="min-h-[20px]">
            {errors.dateOfBirth && (
              <p
                className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
                style={{
                  textShadow:
                    "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
                }}
              >
                ⚠ {errors.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          <div className="min-h-[20px]">
            {errors.gender && (
              <p
                className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
                style={{
                  textShadow:
                    "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
                }}
              >
                ⚠ {errors.gender.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Step 2: Preferences
function PreferencesStep({
  form,
}: {
  form: UseFormReturn<PreferencesFormData>;
}) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  // Use local state instead of watch() to prevent re-renders
  // Initialize from form, but don't sync - form will be reset by parent when navigating back
  const formInitialInterests = getValues("interests") || [];
  const [interests, setInterests] = useState<string[]>(formInitialInterests);

  // Only sync once on mount if form has values we don't have
  useEffect(() => {
    const currentFormInterests = getValues("interests") || [];
    if (
      currentFormInterests.length > 0 &&
      JSON.stringify(currentFormInterests) !== JSON.stringify(interests)
    ) {
      setInterests(currentFormInterests);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  const availableInterests = [
    "Gaming",
    "Technology",
    "Sports",
    "Music",
    "Art",
    "Travel",
    "Food",
    "Fitness",
  ];

  const toggleInterest = (interest: string) => {
    const current = interests || [];
    const newInterests = current.includes(interest)
      ? current.filter((i: string) => i !== interest)
      : [...current, interest];
    setInterests(newInterests);
    setValue("interests", newInterests, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
          Interests
        </label>
        <div className="grid grid-cols-2 gap-3">
          {availableInterests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`py-3 px-4 border rounded-sm font-mono text-sm transition-all cursor-pointer ${
                interests.includes(interest)
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-gray-700 text-white hover:border-primary/50"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <div className="min-h-[20px]">
          {errors.interests && (
            <p
              className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
              style={{
                textShadow:
                  "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
              }}
            >
              ⚠ {errors.interests.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
          Language
        </label>
        <select
          {...register("language")}
          className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-4 px-4 focus:ring-1 focus:outline-none transition-all"
        >
          <option value="">Select language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
        </select>
        <div className="min-h-[20px]">
          {errors.language && (
            <p
              className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
              style={{
                textShadow:
                  "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
              }}
            >
              ⚠ {errors.language.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
          Notification Preferences
        </label>
        <div className="space-y-3">
          {(["email", "push", "sms"] as const).map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                {...register(`notifications.${type}` as const)}
                className="w-4 h-4 text-primary bg-[#1a1a1a] border-gray-700 rounded focus:ring-primary"
              />
              <span className="text-white font-mono text-sm capitalize">
                {type} notifications
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
