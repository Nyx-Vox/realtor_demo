import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Aptos", "Inter", "Segoe UI", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 17, 17, 0.12)",
        brand: "0 24px 80px rgba(239, 59, 36, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
