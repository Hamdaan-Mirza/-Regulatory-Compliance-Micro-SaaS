"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, magicLinkSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export type LoginState = { error?: string; magicLinkSent?: boolean };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const supabase = await createClient(parsed.data.rememberMe);

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function magicLinkAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient(true);

  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  // Always report success — do not reveal whether the email is registered.
  return { magicLinkSent: true };
}