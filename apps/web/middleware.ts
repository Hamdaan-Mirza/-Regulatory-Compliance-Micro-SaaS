import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Helper to interact with Cloudflare Rate Limiter binding
async function checkRateLimit(request: NextRequest): Promise<boolean> {
  // Try to access Cloudflare's bindings using @cloudflare/next-on-pages context
  // Fallback to true if running locally outside wrangler
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx = getRequestContext();
    if (ctx.env && (ctx.env as any).RATE_LIMITER) {
      const rateLimiter = (ctx.env as any).RATE_LIMITER;
      // Use IP for rate limiting
      const ip = request.headers.get("cf-connecting-ip") || "127.0.0.1";
      const { success } = await rateLimiter.limit({ key: ip });
      return success;
    }
  } catch (e) {
    // Ignore error if context is not available (e.g. standard Node env)
  }
  return true; // Allow by default if no binding found
}

export async function middleware(request: NextRequest) {
  // Rate limiting for auth and data routes
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  
  if (isAuthRoute || request.nextUrl.pathname.startsWith("/api")) {
    const isAllowed = await checkRateLimit(request);
    if (!isAllowed) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: any }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!user && (isProtectedRoute || isAdminRoute)) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAdminRoute) {
    // RBAC: Verify if the user has the 'admin' role
    // Supabase stores user metadata which we mapped. We need to query the users table since metadata is not guaranteed to have the DB role in this setup, or we check auth metadata.
    // Assuming role is in user metadata (or query public.users table)
    // For edge runtime, it's safer to fetch from public.users to be definitive.
    const { data: dbUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};