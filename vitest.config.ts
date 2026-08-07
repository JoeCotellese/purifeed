// ABOUTME: Vitest configuration for LinkedIn Purify unit tests.
// ABOUTME: Runs the DOM-only purify logic under jsdom, no browser required.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['lib/**/*.test.ts'],
  },
});
