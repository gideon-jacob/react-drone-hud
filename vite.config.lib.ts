import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src/index.ts", "src/components/DroneHud.tsx"],
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "ReactDroneHud",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        exports: "named",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css" || assetInfo.name?.endsWith(".css")) {
            return "style.css";
          }
          return assetInfo.name || "asset";
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
