import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the build work whether deployed at root or in a sub-path
// (e.g. https://username.github.io/aircraft-trainer/).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, host: true }
});
