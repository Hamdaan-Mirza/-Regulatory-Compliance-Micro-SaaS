import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface Database {}

export const createSupabase = (
  supabaseUrl: string,
  supabaseAnonKey: string,
): SupabaseClient<Database> => createClient<Database>(supabaseUrl, supabaseAnonKey);
