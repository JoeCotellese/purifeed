# Purifeed — Chrome Web Store Listing Copy

Paste-ready copy for the Chrome Web Store developer dashboard. Field names match
the dashboard tabs. Character limits noted where Google enforces them.

## Product name

```
Purifeed
```

## Category

Productivity

## Language

English (United States)

## Summary / short description (max 132 characters)

```
Hide suggested posts, promoted ads, News, and puzzles from your LinkedIn feed. No tracking. No data collection. Fully local.
```

## Detailed description

```
Purifeed cleans up your LinkedIn feed so you see the people and posts you
actually follow — not the noise LinkedIn injects around them.

Turn any of these off with a single toggle:

• Suggested posts — "Suggested" content from people and pages you don't follow
• Promoted posts — sponsored "Promoted" ads in the feed
• LinkedIn News — the right-rail "LinkedIn News" / "Top stories" module
• Today's puzzles — the right-rail games module (Zip, Wend, Mini Sudoku, and the rest)

Flip a switch and open LinkedIn tabs update right away — no reload needed.

Private by design:
• No data collection. Purifeed stores only your on/off settings, on your device.
• No network requests. It never phones home or loads remote code.
• No tracking, no analytics, no ads.

Open source and MIT-licensed. Purifeed is not affiliated with LinkedIn or
Microsoft.
```

## Single purpose (dashboard "Single purpose" field)

```
Purifeed has one purpose: to let the user hide specific noise elements
(suggested posts, promoted posts, the News module, and the puzzles module) from
the LinkedIn feed they are viewing.
```

## Permission justifications

**`storage`**

```
Used to save the user's filter preferences (which toggles are enabled) so their
choices persist between browser sessions. No other data is stored.
```

**Host permission — `*://*.linkedin.com/*`**

```
The extension runs a content script on linkedin.com to read the feed on the page
the user is viewing and hide the elements they have chosen to hide. This access
is required to modify the page in place. No page content is collected or
transmitted; all processing happens locally in the browser tab.
```

## Data usage disclosures (Privacy practices tab)

Answer all data-collection questions as **not collected**:

- Personally identifiable information — No
- Health information — No
- Financial and payment information — No
- Authentication information — No
- Personal communications — No
- Location — No
- Web history — No
- User activity — No
- Website content — No

Certifications (check all three — all are true):

- [x] Does not sell or transfer user data to third parties, outside of approved use cases
- [x] Does not use or transfer user data for purposes unrelated to the item's single purpose
- [x] Does not use or transfer user data to determine creditworthiness or for lending purposes

## Privacy policy URL

```
https://github.com/JoeCotellese/purifeed/blob/main/PRIVACY.md
```

## Store assets checklist

- [ ] Icon 128×128 (already in `public/icon/128.png`)
- [ ] Screenshot(s) 1280×800 or 640×400 — at least one required:
  - [ ] Settings page (`docs/store-assets/screenshot-settings.png` — generated)
  - [ ] LinkedIn feed BEFORE (noise visible) — needs a logged-in session
  - [ ] LinkedIn feed AFTER (noise hidden) — needs a logged-in session
- [ ] Small promo tile 440×280 (recommended, not required)
- [ ] Marquee promo 1400×560 (optional)
