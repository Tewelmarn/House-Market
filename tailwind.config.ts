import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#af101a",
          container: "#d32f2f",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#875200",
          container: "#f89c00",
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#6d5049",
          container: "#886861",
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "#fbf9f6",
          dim: "#dbdad7",
          low: "#f5f3f0",
          container: "#efeeeb",
          high: "#eae8e5",
          highest: "#e4e2df",
        },
        outline: {
          DEFAULT: "#8f6f6c",
          variant: "#e4beba",
        },
        "on-surface": "#1b1c1a",
        "on-surface-variant": "#5b403d",
      },
      fontFamily: {
        headline: ["Be Vietnam Pro", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        tactile: "0 2px 12px rgba(78,52,46,0.08), 0 0 0 1px rgba(78,52,46,0.06)",
        card: "0 1px 3px rgba(78,52,46,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
