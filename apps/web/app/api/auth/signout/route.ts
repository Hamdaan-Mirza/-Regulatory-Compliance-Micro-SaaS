import { createSupabaseServerClient } from "@complystack/db/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });
}
