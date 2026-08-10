// ABOUTME: Pure DOM logic for finding and hiding LinkedIn right-rail display ads (sponsored creatives).
// ABOUTME: No extension/WXT imports so it runs under jsdom in unit tests.

/**
 * Selector for a LinkedIn display ad, as seen from the page that hosts it.
 *
 * LinkedIn renders each display ad inside an `about:blank` iframe it populates from its own JS, and
 * tags that iframe `title="advertisement"` (an IAB convention). The parent frame can only reach the
 * iframe element, not its contents, so we hide the iframe itself. The obfuscated class hashes on the
 * iframe change across renders, but the title does not, so we anchor on it.
 *
 * The remaining two selectors match the creative container *inside* the ad frame
 * (`data-creative="urn:li:sponsoredCreative:..."`, or the classic `id="ads-container"`), a fallback
 * for any surface where LinkedIn renders the ad into the light DOM instead of an iframe. Keying on
 * the sponsoredCreative URN means only real ad units match, never ordinary posts or sidebar modules.
 */
const DISPLAY_AD_SELECTOR =
  'iframe[title="advertisement"], [data-creative^="urn:li:sponsoredCreative:"], #ads-container';

/** Data attributes marking an ad we hid and the display value we replaced. */
const HIDDEN_ATTR = 'lipAdHidden';
const PREV_DISPLAY_ATTR = 'lipAdPrevDisplay';

/** Find every right-rail display ad in `scope`. */
export function findDisplayAds(scope: ParentNode): HTMLElement[] {
  return [...scope.querySelectorAll<HTMLElement>(DISPLAY_AD_SELECTOR)];
}

/**
 * Hide every display ad in `scope` not already hidden, remembering each one's previous inline
 * display so restore can put it back. Returns how many were newly hidden.
 */
export function hideDisplayAds(scope: ParentNode): number {
  let hidden = 0;
  for (const el of findDisplayAds(scope)) {
    if (el.dataset[HIDDEN_ATTR] === 'true') continue;
    el.dataset[PREV_DISPLAY_ATTR] = el.style.display;
    el.style.display = 'none';
    el.dataset[HIDDEN_ATTR] = 'true';
    hidden += 1;
  }
  return hidden;
}

/**
 * Restore every display ad this extension hid in `scope`, back to its original inline display.
 * Returns how many were restored.
 */
export function restoreDisplayAds(scope: ParentNode): number {
  let restored = 0;
  scope.querySelectorAll<HTMLElement>('[data-lip-ad-hidden="true"]').forEach((el) => {
    el.style.display = el.dataset[PREV_DISPLAY_ATTR] ?? '';
    delete el.dataset[HIDDEN_ATTR];
    delete el.dataset[PREV_DISPLAY_ATTR];
    restored += 1;
  });
  return restored;
}
