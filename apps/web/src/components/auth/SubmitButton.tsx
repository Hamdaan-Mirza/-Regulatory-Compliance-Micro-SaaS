"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-compliance-navy py-2.5 text-sm font-semibold text-paper-white hover:bg-midnight disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
    >
      {pending && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper-white/40 border-t-paper-white" />
      )}
      {children}
    </button>
  );
}