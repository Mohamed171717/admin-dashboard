import { defineConfig } from "tailwindcss";
import daisyui from "daisyui";

export default defineConfig({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FAF7F0", // Background
        secondary: "#D8D2C2", // Secondary elements
        accent: "#B17457", // Buttons, highlights
        neutral: "#4A4947", // Text, borders
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // Customize as needed
  },
});
