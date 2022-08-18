import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import GlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = {...process.env, ...loadEnv(mode, process.cwd(), '')}
  return {
    plugins: [vue()/*, nodePolyfills*/],
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT)
    },
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), 
        http: "http-browserify",
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          GlobalsPolyfills({
            process: true,
            buffer: true
          })
        ],
        define: {
          global: 'globalThis',
          
        }
      }
    }
  }
})

