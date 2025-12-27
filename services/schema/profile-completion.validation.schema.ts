import { z } from "zod";

// Step 2: Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "SYSTEM ERROR: IDENTIFIER MISSING"),
  lastName: z.string().min(1, "SYSTEM ERROR: IDENTIFIER MISSING"),
  displayName: z.string().min(1, "SYSTEM ERROR: CALLSIGN REQUIRED"),
  dateOfBirth: z.string().min(1, "SYSTEM ERROR: TIMESTAMP INVALID"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    message: "ACCESS DENIED: INVALID CLASSIFICATION",
  }),
});

// Step 2: Location (removed - now part of personal info)
export const locationSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
});

// Step 3: Preferences
export const preferencesSchema = z.object({
  interests: z.array(z.string()).min(1, "SYSTEM REJECTION: NO SPECIALIZATIONS SELECTED"),
  language: z.string().min(1, "SYSTEM ERROR: COMM PROTOCOL NOT SET"),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
});

// Combined schema for final submission
export const profileCompletionSchema = z.object({
  avatar: z.string().min(1, "SYSTEM ERROR: OPERATOR VISUAL ID REQUIRED"),
  personalInfo: personalInfoSchema,
  preferences: preferencesSchema,
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
export type ProfileCompletionFormData = z.infer<typeof profileCompletionSchema>;

