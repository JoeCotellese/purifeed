// ABOUTME: WXT build configuration for the LinkedIn Purify extension.
// ABOUTME: Defines the shared manifest used for both Chrome and Firefox builds.
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  // `manifest` is a function so we can add the Firefox-only add-on ID without it
  // leaking into the Chrome manifest, where `browser_specific_settings` is invalid.
  manifest: ({ browser }) => ({
    name: 'LinkedIn Purify',
    description: 'Strip suggested posts, promoted clutter, and noise out of your LinkedIn feed.',
    permissions: ['storage'],
    host_permissions: ['*://*.linkedin.com/*'],
    ...(browser === 'firefox'
      ? { browser_specific_settings: { gecko: { id: 'lipurify@cotellese.me' } } }
      : {}),
  }),
});
