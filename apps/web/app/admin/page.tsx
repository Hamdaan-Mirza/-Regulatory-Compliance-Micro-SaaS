import { createSupabaseServerClient } from "@complystack/db/server";
import { cookies } from "next/headers";

export const runtime = "edge";
import { redirect } from "next/navigation";
import pino from "pino";

const logger = pino({
  level: "info",
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // Pino works on Edge runtimes minimally if we avoid node-only transports
  browser: {
    asObject: true,
  },
});

export const revalidate = 0; // Ensure data is fetched fresh

export default async function AdminPage() {
  const startTime = Date.now();
  const supabase = createSupabaseServerClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // We rely on middleware to enforce RBAC, but can verify here too if needed
  // Let's assume middleware handled it. We'll fetch hardware data.
  
  const { data, error } = await supabase
    .from("approved_hardware")
    .select("*")
    .order("brand", { ascending: true });
    
  const hardwareList = data as any[];

  const executionTimeMs = Date.now() - startTime;

  if (error) {
    logger.error({
      user_id: user.id,
      trace_id: crypto.randomUUID(),
      execution_ms: executionTimeMs,
      error: error.message,
    }, "Failed to fetch hardware data");
  } else {
    logger.info({
      user_id: user.id,
      trace_id: crypto.randomUUID(),
      execution_ms: executionTimeMs,
      rowCount: hardwareList?.length || 0,
    }, "Successfully fetched approved hardware list");
  }

  return (
    <div className="min-h-screen bg-cloud-gray font-body text-midnight">
      <nav className="bg-compliance-navy shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center text-paper-white font-heading font-bold text-xl">
                ComplyStack Admin
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-paper-white text-sm hover:text-circuit-blue">
                Back to Dashboard
              </a>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="text-sm font-medium text-paper-white hover:text-circuit-blue">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="bg-paper-white shadow rounded-lg p-6 border border-slate-gray/20">
          <div className="mb-6">
            <h3 className="text-h3 font-heading text-compliance-navy">
              Hardware Sync Status
            </h3>
            <p className="text-body text-slate-gray">
              Official NRS 097-2-1 Inverter Registry
            </p>
          </div>

          {error ? (
            <div className="bg-status-not-approved/10 border border-status-not-approved text-status-not-approved px-4 py-3 rounded-md text-sm">
              Error fetching data: {error.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-gray/30">
                <thead className="bg-cloud-gray/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-compliance-navy uppercase tracking-wider">
                      Brand
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-compliance-navy uppercase tracking-wider">
                      Model Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-compliance-navy uppercase tracking-wider">
                      Capacity (kW)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-compliance-navy uppercase tracking-wider">
                      Anti-Islanding
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-paper-white divide-y divide-slate-gray/20">
                  {hardwareList && hardwareList.length > 0 ? (
                    hardwareList.map((hw) => (
                      <tr key={hw.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-midnight">
                          {hw.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-gray">
                          {hw.model_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-gray">
                          {hw.kw_capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hw.anti_islanding_certified ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-status-approved/20 text-status-approved">
                              Certified
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-status-not-approved/20 text-status-not-approved">
                              Not Certified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-gray">
                        No hardware records found. Did you run the ingestion script?
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
