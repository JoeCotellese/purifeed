// ABOUTME: Reusable remover for LinkedIn right-rail sidebar modules, keyed on module title text.
// ABOUTME: No extension/WXT imports so it runs under jsdom in unit tests.

/**
 * Exact visible titles of the right-rail modules this extension can strip. These are the
 * single source of truth for the title strings (mind the curly apostrophe in "Today’s"),
 * shared by the content script and settings so a checkbox and its target never drift apart.
 * Each module is toggled independently, so hiding is driven per-title, not as a batch.
 */
export const NEWS_TITLE = 'LinkedIn News';
export const PUZZLES_TITLE = 'Today’s puzzles';

/** Data attributes marking a module we hid, the display value we replaced, and which module it is. */
const HIDDEN_ATTR = 'lipModuleHidden';
const PREV_DISPLAY_ATTR = 'lipModulePrevDisplay';
const TITLE_ATTR = 'lipModuleTitle';

/**
 * Find the root element of the right-rail module whose title is exactly `title`.
 *
 * LinkedIn renders each module title as a `<p>` whose entire trimmed text is the title
 * (e.g. "LinkedIn News"). The module's root is that paragraph's nearest ancestor carrying
 * a `componentkey` attribute, which wraps the title, its items, and the "show more" button.
 * Obfuscated class names and the componentkey value both change across renders, so we anchor
 * on the title text and the mere presence of the attribute, never on their values. Matching
 * the paragraph's trimmed text exactly avoids false positives from body copy that merely
 * contains the title words.
 */
export function findSidebarModule(scope: ParentNode, title: string): HTMLElement | null {
  for (const p of scope.querySelectorAll('p')) {
    if (p.textContent?.trim() !== title) continue;
    const root = p.closest<HTMLElement>('[componentkey]');
    if (root) return root;
  }
  return null;
}

/**
 * Hide the module titled `title` if present and not already hidden. Tags the element with
 * the title so restore can target this module alone. Returns 1 if it newly hid one, else 0.
 */
export function hideSidebarModule(scope: ParentNode, title: string): number {
  const el = findSidebarModule(scope, title);
  if (!el || el.dataset[HIDDEN_ATTR] === 'true') return 0;
  el.dataset[PREV_DISPLAY_ATTR] = el.style.display;
  el.dataset[TITLE_ATTR] = title;
  el.style.display = 'none';
  el.dataset[HIDDEN_ATTR] = 'true';
  return 1;
}

/**
 * Restore every module this extension hid whose title is `title`, back to its original
 * inline display. Independent of the other toggles: turning Puzzles off never disturbs News.
 * Returns how many were restored.
 */
export function restoreSidebarModule(scope: ParentNode, title: string): number {
  let restored = 0;
  scope.querySelectorAll<HTMLElement>('[data-lip-module-hidden="true"]').forEach((el) => {
    if (el.dataset[TITLE_ATTR] !== title) return;
    el.style.display = el.dataset[PREV_DISPLAY_ATTR] ?? '';
    delete el.dataset[HIDDEN_ATTR];
    delete el.dataset[PREV_DISPLAY_ATTR];
    delete el.dataset[TITLE_ATTR];
    restored += 1;
  });
  return restored;
}
