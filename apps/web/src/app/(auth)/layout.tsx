import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-compliance-navy text-paper-white p-12">
        <Link href="/" className="font-heading text-xl font-bold">
          ComplyStack
        </Link>
        <div className="max-w-md">
          <p className="font-heading text-3xl font-bold leading-tight mb-4">
            SSEG compliance, automated.
          </p>
          <p className="text-cloud-gray text-sm leading-relaxed">
            Upload a solar invoice. Get a validated, municipality-ready registration
            pack in seconds — no manual paperwork, no missed deadlines.
          </p>
        </div>
        <p className="text-slate-gray text-xs">© {new Date().getFullYear()} ComplyStack</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-paper-white">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}