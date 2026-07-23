import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["homeowner", "epc_installer"]), // Admin is usually not selectable in public registration
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const HardwareIngestionSchema = z.object({
  brand: z.string().min(1),
  model_number: z.string().min(1),
  kw_capacity: z.number().positive(),
  anti_islanding_certified: z.boolean(),
});

export type HardwareIngestionInput = z.infer<typeof HardwareIngestionSchema>;
