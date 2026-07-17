"use server";

import { createClient } from "@/lib/supabase/server";
import { emailSchema } from "@/lib/validation/auth";

export type ForgotState = { sent?: boolean };

export async function forgotPasswordAction(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { sent: true }; // never reveal validation failures tied to enumeration

  const supabase = await createClient(true);
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  return { sent: true };
}