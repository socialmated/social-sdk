/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@social-sdk/facebook',
    passWithNoTests: true,
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'istanbul',
    },
    typecheck: {
      tsconfig: path.resolve(import.meta.dirname, 'tsconfig.spec.json'),
    },
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
});
