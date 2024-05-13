import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
  build: {
    target: "esnext",
    lib: {
      entry: [
        // resolve(__dirname, 'lib/main.ts'),
        resolve(__dirname, 'lib/link/Link.vue'),
        resolve(__dirname, 'lib/button/Button.vue'),
      ],
      name: 'VueComponentNpmExample',
      fileName: (format, name) => {
        if (format === "es") {
          return `${name}/${name}.js`
        }
        return `${name}/${name}.${format}`
      }
    },
    rollupOptions: {

      external: ['vue'],
      output: [
        {
          // file: 'dist/app.js',
          // dir: "app",
          entryFileNames: "button/index.js",
          format: 'esm',
          sourcemap: 'inline',
          globals: {
            vue: 'Vue'
          },
        },
        {
        // file: 'dist/app.js',
        // dir: "app",
        entryFileNames: "link/index.js",
        format: 'esm',
        sourcemap: 'inline',
        globals: {
          vue: 'Vue'
        },
      }]
    }
  }
})
