import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed at https://<user>.github.io/aircraft-trainer/ so assets must be
// requested from /aircraft-trainer/. In dev (npm run dev) the base is '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/aircraft-trainer/' : '/',
  server: { port: 5173, host: true }
}));
