import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative assets work for both a GitHub project page and a custom domain.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
