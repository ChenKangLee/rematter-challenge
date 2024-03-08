import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import Components from "unplugin-vue-components/vite";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/assets/quasar-variables.sass",
    }),
    Components({
      dirs: ["./src/components"],
      extensions: ["vue"],
      deep: true,
      dts: false,
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.next[\\/]/,
      ],
    }),
    Inspect({ enabled: true }),
  ],
});
