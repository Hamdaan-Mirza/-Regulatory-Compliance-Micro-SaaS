"use client";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {rules.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.label}
            className={`text-xs flex items-center gap-1.5 ${
              met ? "text-signal-teal" : "text-slate-gray"
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                met ? "bg-signal-teal" : "bg-cloud-gray"
              }`}
            />
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}