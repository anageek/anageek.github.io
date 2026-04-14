import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/helpers/setup.ts'],
    include: ['src/__tests__/unit/**/*.test.ts', 'src/__tests__/integration/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './src/__tests__/helpers/server-only-mock.ts'),
    },
  },
})
