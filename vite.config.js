import { defineConfig } from 'vite';

// base './' = path relatif, sehingga build berjalan di sub-path GitHub Pages
// (https://<user>.github.io/Sherlocomp-world/) maupun di dalam WebView Capacitor.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900, // Three.js ±700 KB sebelum gzip
  },
  server: { host: true, port: 5173 },
});
