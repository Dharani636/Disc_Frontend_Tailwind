/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core admin shell
        ink: {
          950: "#0b1220",
          900: "#0f172a",
          800: "#16213a",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
        },
        // DISC data-viz palette — kept distinct from UI brand color
        disc: {
          d: "#5B21B6",
          i: "#0F766E",
          s: "#1D4ED8",
          c: "#B45309",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 1px 8px rgba(15,23,42,0.06)",
        "card-hover": "0 2px 4px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
