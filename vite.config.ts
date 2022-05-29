import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://192.168.137.1:9000'
    }
  },
  resolve: {
    alias: {
      "@": '/src/'
    }
  }
})