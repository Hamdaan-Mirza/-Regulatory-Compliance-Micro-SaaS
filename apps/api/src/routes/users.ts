import { Hono } from "hono";
import { createSupabaseAdminClient } from "@complystack/db";
import type { AuthenticatedUserDTO } from "@complystack/types";
import type { Env, AuthContext } from "../types";
import { requireAuth } from "../auth";

export const usersRoute = new Hono<{ Bindings: Env; Variables: { auth: AuthContext } }>();

usersRoute.get("/me", requireAuth, async (c) => {
  const auth = c.get("auth");

  const supabase = createSupabaseAdminClient({
    url: c.env.SUPABASE_URL,
    serviceRoleKey: c.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, credit_balance")
    .eq("id", auth.userID)
    .single();

  if (error || !data) {
    return c.json({ error: "user profile not found" }, 404);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbUser = data as any;
  const dto: AuthenticatedUserDTO = {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    role: dbUser.role,
    creditBalance: dbUser.credit_balance,
  };

  return c.json(dto);
});