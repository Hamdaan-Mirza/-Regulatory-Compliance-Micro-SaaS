import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { Database } from "@complystack/types";

export function createSupabaseServerClient(cookies: CookieMethodsServer) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Anon key + user's cookies -> requests are still bound by RLS as that user.
  return createServerClient<Database>(url, anonKey, { cookies });
}