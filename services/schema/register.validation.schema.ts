import { z } from "zod";

export const registerEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export type RegisterEmailFormData = z.infer<typeof registerEmailSchema>;
