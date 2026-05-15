import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070d",
        foreground: "#eef6ff",
        border: "rgba(148, 163, 184, 0.22)",
        muted: "#93a4b8",
        card: "rgba(10, 17, 30, 0.74)",
        accent: "#38bdf8",
        accentForeground: "#00131d",
        danger: "#b91c1c",
        success: "#10b981",
      },
      boxShadow: {
        card: "0 24px 70px -32px rgba(14, 165, 233, 0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
