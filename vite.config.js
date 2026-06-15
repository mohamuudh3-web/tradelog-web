import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://mohamuudh3-web.github.io/tradelog-web/ in production,
// but from the root locally so `npm run dev` keeps working at 127.0.0.1.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/tradelog-web/' : '/',
  plugins: [react()],
}))
