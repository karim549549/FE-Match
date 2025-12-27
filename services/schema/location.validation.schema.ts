import { z } from "zod";

export const locationSelectionSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  country: z.string().min(1, "SYSTEM ERROR: DEPLOYMENT ZONE NOT IDENTIFIED"),
  city: z.string().min(1, "SYSTEM ERROR: SECTOR NOT IDENTIFIED"),
  address: z.string().optional(),
  timezone: z.string().optional(),
});

export type LocationSelectionFormData = z.infer<typeof locationSelectionSchema>;

