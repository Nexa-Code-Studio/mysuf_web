import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pertamina-red": "#E31837",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
