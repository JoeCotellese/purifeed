# LinkedIn Purify — Extension

Browser extension (Chrome + Firefox) that strips suggested posts, promoted
clutter, and noise out of the LinkedIn feed. Built with [WXT](https://wxt.dev).

> **Private repository.** The public marketing site lives in a separate repo.

## Develop

```sh
npm install
npm run dev            # Chrome, with hot reload
npm run dev:firefox    # Firefox
```

## Build & package

```sh
npm run build          # Chrome  -> .output/chrome-mv3
npm run build:firefox  # Firefox -> .output/firefox-mv2
npm run zip            # zipped store artifact (Chrome)
npm run zip:firefox    # zipped store artifact (Firefox)
npm run compile        # type-check only
```

## Layout

- `entrypoints/linkedin.content.ts` — content script that hides feed noise
- `entrypoints/popup/` — toolbar popup UI
- `entrypoints/background.ts` — background service worker
- `wxt.config.ts` — manifest and build config

LinkedIn Purify is not affiliated with LinkedIn or Microsoft.
