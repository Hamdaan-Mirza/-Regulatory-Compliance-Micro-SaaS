import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        status: {
          approved: "#06B6A4",
          unverified: "#D97706",
          "not-approved": "#DC2626",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        h1: ["40px", { lineHeight: "48px", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        h4: ["16px", { lineHeight: "22px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["11px", { lineHeight: "15px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
} satisfies Config;