"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const [password, setPassword] = useState("");

  if (state.success) {
    return (
      <div className="text-center">
        <h1 className="font-heading text-xl font-bold text-compliance-navy mb-2">Check your email</h1>
        <p className="text-sm text-slate-gray">
          We've sent a confirmation link. Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-compliance-navy mb-1">Create your account</h1>
      <p className="text-sm text-slate-gray mb-6">Start automating your SSEG compliance packs.</p>

      <OAuthButtons />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-cloud-gray" />
        <span className="text-xs text-slate-gray">or</span>
        <div className="h-px flex-1 bg-cloud-gray" />
      </div>

      <form action={formAction} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          autoComplete="email"
          className="w-full rounded-lg border border-cloud-gray bg-white px-3 py-2.5 text-sm text-compliance-navy placeholder:text-slate-gray focus:outline-none focus:ring-2 focus:ring-circuit-blue"
        />
        <div>
          <PasswordInput
            name="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <PasswordChecklist password={password} />
        </div>

        {state.error && <p className="text-sm text-not-approved">{state.error}</p>}

        <SubmitButton>Create account</SubmitButton>
      </form>

      <p className="text-sm text-slate-gray text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-circuit-blue font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}