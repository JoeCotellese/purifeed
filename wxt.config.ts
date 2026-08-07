// ABOUTME: WXT build configuration for the LinkedIn Purify extension.
// ABOUTME: Defines the shared manifest used for both Chrome and Firefox builds.
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'LinkedIn Purify',
    description: 'Strip suggested posts, promoted clutter, and noise out of your LinkedIn feed.',
    permissions: ['storage'],
    host_permissions: ['*://*.linkedin.com/*'],
  },
});
