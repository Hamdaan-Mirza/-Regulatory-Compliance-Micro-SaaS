"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, magicLinkAction, type LoginState } from "./actions";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [magicState, magicAction] = useActionState(magicLinkAction, initialState);
  const [password, setPassword] = useState("");
  const [showMagicLink, setShowMagicLink] = useState(false);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-compliance-navy mb-1">Welcome back</h1>
      <p className="text-sm text-slate-gray mb-6">Log in to your ComplyStack dashboard.</p>

      <OAuthButtons />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-cloud-gray" />
        <span className="text-xs text-slate-gray">or</span>
        <div className="h-px flex-1 bg-cloud-gray" />
      </div>

      {!showMagicLink ? (
        <>
          <form action={formAction} className="space-y-4">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              autoComplete="email"
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-compliance-navy placeholder:text-slate-gray focus:outline-none focus:ring-2 focus:ring-circuit-blue ${
                state.error ? "border-not-approved" : "border-cloud-gray"
              }`}
            />
            <div>
              <PasswordInput
                name="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-xs text-circuit-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-gray">
              <input type="checkbox" name="rememberMe" className="rounded border-cloud-gray accent-circuit-blue" />
              Remember me
            </label>

            {state.error && <p className="text-sm text-not-approved">{state.error}</p>}

            <SubmitButton>Log in</SubmitButton>
          </form>

          <button
            type="button"
            onClick={() => setShowMagicLink(true)}
            className="w-full text-center text-sm text-circuit-blue hover:underline mt-4"
          >
            Email me a login link instead
          </button>
        </>
      ) : magicState.magicLinkSent ? (
        <p className="text-sm text-slate-gray text-center">
          If that email is registered, a login link is on its way. Check your inbox.
        </p>
      ) : (
        <form action={magicAction} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            autoComplete="email"
            className="w-full rounded-lg border border-cloud-gray bg-white px-3 py-2.5 text-sm text-compliance-navy placeholder:text-slate-gray focus:outline-none focus:ring-2 focus:ring-circuit-blue"
          />
          {magicState.error && <p className="text-sm text-not-approved">{magicState.error}</p>}
          <SubmitButton>Send login link</SubmitButton>
          <button
            type="button"
            onClick={() => setShowMagicLink(false)}
            className="w-full text-center text-sm text-slate-gray hover:underline"
          >
            Back to password login
          </button>
        </form>
      )}

      <p className="text-sm text-slate-gray text-center mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-circuit-blue font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}