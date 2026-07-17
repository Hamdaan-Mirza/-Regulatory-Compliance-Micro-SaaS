import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@complystack/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, credit_balance")
    .eq("id", user.id)
    .single<{ role: UserRole; credit_balance: number }>();

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-compliance-navy mb-6">Dashboard</h1>
        <div className="rounded-xl border border-cloud-gray bg-white p-6 flex gap-8">
          <div>
            <p className="text-xs text-slate-gray uppercase tracking-wide">Account type</p>
            <p className="font-heading text-lg font-semibold text-compliance-navy">
              {profile?.role ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-gray uppercase tracking-wide">Credit balance</p>
            <p className="font-heading text-lg font-semibold text-signal-teal">
              {profile?.credit_balance ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}