"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@complystack/types";
import { createSupabaseBrowserClient } from "@complystack/db/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cloud-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body text-midnight">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-h2 text-compliance-navy font-heading">
          ComplyStack
        </h2>
        <p className="mt-2 text-center text-body text-slate-gray">
          Autonomous Regulatory Compliance Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-paper-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-gray/20">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-status-not-approved/10 border border-status-not-approved text-status-not-approved px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-compliance-navy"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border border-slate-gray/30 rounded-md shadow-sm placeholder-slate-gray focus:outline-none focus:ring-circuit-blue focus:border-circuit-blue sm:text-sm",
                    errors.email && "border-status-not-approved"
                  )}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-status-not-approved">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-compliance-navy"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border border-slate-gray/30 rounded-md shadow-sm placeholder-slate-gray focus:outline-none focus:ring-circuit-blue focus:border-circuit-blue sm:text-sm",
                    errors.password && "border-status-not-approved"
                  )}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-status-not-approved">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-paper-white bg-compliance-navy hover:bg-compliance-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-circuit-blue disabled:opacity-50"
              >
                {isSubmitting ? "Authenticating..." : "Sign in"}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm">
               <span className="text-slate-gray">Need an account?</span>{' '}
               <a href="/register" className="font-medium text-circuit-blue hover:text-circuit-blue/80">
                 Register here
               </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
