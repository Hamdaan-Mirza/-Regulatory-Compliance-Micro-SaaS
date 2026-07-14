import type { Context, Next } from "hono";
import { jwtVerify, createRemoteJWKSet } from "jose";
import type { Env, AuthContext } from "./types";

let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(supabaseUrl: string) {
  if (!jwksCache) {
    jwksCache = createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
  }
  return jwksCache;
}

export async function requireAuth(c: Context<{ Bindings: Env; Variables: { auth: AuthContext } }>, next: Next) {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "missing authorization token" }, 401);
  }

  try {
    const jwks = getJwks(c.env.SUPABASE_URL);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${c.env.SUPABASE_URL}/auth/v1`,
    });

    if (!payload.sub || typeof payload.email !== "string") {
      return c.json({ error: "malformed token claims" }, 401);
    }

    c.set("auth", { userID: payload.sub, email: payload.email });
    await next();
  } catch {
    return c.json({ error: "invalid or expired token" }, 401);
  }
}