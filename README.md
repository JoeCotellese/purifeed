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

## Reproducible build (for AMO reviewers)

This add-on is built with [WXT](https://wxt.dev), which uses Vite (esbuild) to
bundle, transpile TypeScript, and minify. To reproduce the exact submitted
Firefox package from this source archive:

**Environment**
- Any OS (submission built and tested on macOS)
- Node.js >= 20 (this submission was built with Node 26.6.0, npm 11.18.0)

**Steps**

```sh
npm ci                 # install exact versions from package-lock.json
npm run zip:firefox    # build and zip the Firefox package
```

**Output:** `.output/lipurify-extension-<version>-firefox.zip` (the unpacked
build is in `.output/firefox-mv2/`).

Each module under `entrypoints/` and `lib/` compiles to the matching file in the
built package. The extension makes no network requests, loads no remote code, and
collects no data (see `data_collection_permissions` in `wxt.config.ts`).

## Layout

- `entrypoints/linkedin.content.ts` — content script that hides feed noise
- `entrypoints/popup/` — toolbar popup UI
- `entrypoints/background.ts` — background service worker
- `wxt.config.ts` — manifest and build config

LinkedIn Purify is not affiliated with LinkedIn or Microsoft.
