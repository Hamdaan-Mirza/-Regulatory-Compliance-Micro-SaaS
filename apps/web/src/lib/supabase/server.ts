import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@complystack/types";

export async function createClient(rememberMe = true) {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const finalOptions: CookieOptions = { ...options };
              if (!rememberMe) delete finalOptions.maxAge;
              cookieStore.set(name, value, finalOptions);
            });
          } catch {
            // no-op in Server Components without write access
          }
        },
      },
    }
  );
}