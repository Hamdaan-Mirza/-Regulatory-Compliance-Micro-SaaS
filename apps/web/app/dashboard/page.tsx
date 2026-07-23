import { createSupabaseServerClient } from "@complystack/db/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
    
  const dbUser = data as any;

  return (
    <div className="min-h-screen bg-cloud-gray font-body text-midnight">
      <nav className="bg-compliance-navy shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center text-paper-white font-heading font-bold text-xl">
                ComplyStack Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-paper-white text-sm">
                Credits: {dbUser?.credit_balance ?? 0}
              </span>
              <span className="text-cloud-gray text-sm">
                {dbUser?.firstName} {dbUser?.lastName}
              </span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium text-paper-white hover:text-circuit-blue"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="bg-paper-white shadow rounded-lg p-6 min-h-[400px] flex items-center justify-center border border-slate-gray/20">
          <div className="text-center">
            <h3 className="text-h3 font-heading text-compliance-navy mb-2">
              Welcome to ComplyStack
            </h3>
            <p className="text-body text-slate-gray">
              Upload your technical quotes to auto-generate municipal SSEG compliance forms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
