"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validation/auth";

export type RegisterState = { error?: string; success?: boolean };

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please check your email and password." };
  }

  const supabase = await createClient(true);

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  // Generic message regardless of cause — never reveal if an email is already registered.
  if (error) {
    return { error: "We couldn't create your account. Please try again." };
  }

  return { success: true };
}