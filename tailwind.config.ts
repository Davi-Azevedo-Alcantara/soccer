import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#eff7f2",
          300: "#56c27a",
          700: "#247348",
          900: "#101414",
        },
      },
    },
  },
  plugins: [],
};

export default config;
