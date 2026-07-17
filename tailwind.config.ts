import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6A3D",
          light: "#FF8B5E",
          hover: "#E9592B",
          tint: "#FFF1EA",
        },
        ink: "#111111",
        muted: "#6B7280",
        line: "#E9E9E9",
        surface: "#F7F8FA",
        success: "#22C55E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      keyframes: {
        floatA: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        floatB: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(10px)" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        growBar: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
      },
      animation: {
        floatA: "floatA 6s ease-in-out infinite",
        floatB: "floatB 7s ease-in-out infinite",
        fadeUp: "fadeUp .7s ease both",
        growBar: "growBar .8s ease both",
      },
      boxShadow: {
        brand: "0 6px 20px rgba(255,106,61,0.35)",
        card: "0 20px 40px rgba(17,17,17,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
