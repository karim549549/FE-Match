import { z } from "zod";

export const avatarSchema = z.object({
  avatar: z.string().min(1, "SYSTEM ERROR: OPERATOR VISUAL ID REQUIRED"),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;

