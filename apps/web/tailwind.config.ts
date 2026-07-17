import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "compliance-navy": "#14213D",
        "circuit-blue": "#2F5DFF",
        "signal-teal": "#06B6A4",
        "paper-white": "#FAFAFA",
        "cloud-gray": "#E5E7EB",
        "slate-gray": "#64748B",
        midnight: "#0B1120",
        approved: "#06B6A4",
        unverified: "#F59E0B",
        "not-approved": "#EF4444",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;