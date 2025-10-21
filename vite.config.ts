import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0' // Pour tester sur mobile via réseau local
  },
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})