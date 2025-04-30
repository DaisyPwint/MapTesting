import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  image: z.any().optional(),
})

export type FormData = z.infer<typeof formSchema>;
