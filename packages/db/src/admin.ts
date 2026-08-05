
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@complystack/types";

export function createSupabaseAdminClient(config?: { url: string; serviceRoleKey: string }) {
  const url = config?.url ?? process.env.SUPABASE_URL;
  const serviceRoleKey = config?.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase URL or service role key (server-side only)");
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}