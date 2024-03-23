import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default () => {
  return defineConfig({
    root: "./src",
    base: "./",
    plugins: [reactRefresh()],
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@services": path.resolve(__dirname, "src/services"),
        "@store": path.resolve(__dirname, "src/store"),
        "@type": path.resolve(__dirname, "src/type"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@config": path.resolve(__dirname, "src/config"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
      },
    },
  });
};
