"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type ForgotState } from "./actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPasswordAction, {} as ForgotState);

  if (state.sent) {
    return (
      <p className="text-sm text-slate-gray text-center">
        If that email is registered, a reset link is on its way.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-compliance-navy mb-1">Reset your password</h1>
      <p className="text-sm text-slate-gray mb-6">We'll email you a secure reset link.</p>
      <form action={formAction} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg border border-cloud-gray bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-circuit-blue"
        />
        <SubmitButton>Send reset link</SubmitButton>
      </form>
      <Link href="/login" className="block text-center text-sm text-circuit-blue hover:underline mt-6">
        Back to login
      </Link>
    </div>
  );
}