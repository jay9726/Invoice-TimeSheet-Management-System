/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode !== 'test' && tailwindcss(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/components/ui/**',
        'src/styles/**',
      ],
    },
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-report/index.html',
    },
  },
}))
