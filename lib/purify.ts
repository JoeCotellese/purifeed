// ABOUTME: Pure DOM logic for finding LinkedIn feed posts and detecting "Suggested" and "Promoted" ones.
// ABOUTME: No extension/WXT imports so it runs under jsdom in unit tests.

/** The visually-hidden heading LinkedIn puts at the top of every feed post unit. */
const FEED_POST_HEADING = 'Feed post';

/** Exact label text LinkedIn shows on a suggested (non-followed) feed post. */
const SUGGESTED_LABEL = 'Suggested';

/** Old-markup card selector, kept so the filter still works if LinkedIn serves legacy DOM. */
const LEGACY_CARD_SELECTOR = 'div.feed-shared-update-v2, div[data-id^="urn:li:activity"]';

/** Data attributes marking a post we hid, the display value we replaced, and why we hid it. */
const HIDDEN_ATTR = 'lipHidden';
const PREV_DISPLAY_ATTR = 'lipPrevDisplay';
const REASON_ATTR = 'lipPostReason';

/**
 * Why a post was hidden. Tagged onto the element so each toggle restores only its own posts:
 * turning "hide suggested" off must not un-hide a promoted post, and vice versa.
 */
export const SUGGESTED_REASON = 'suggested';
export const PROMOTED_REASON = 'promoted';

/**
 * Locate the root element of every feed post in `scope`.
 *
 * Current LinkedIn markup uses obfuscated class names, so we anchor on structure
 * that carries meaning: each post opens with an `<h2>` whose text is "Feed post".
 * The post's outer container is that heading's parent. We also match the legacy
 * `.feed-shared-update-v2` card so an older DOM still gets filtered.
 */
export function findFeedPostRoots(scope: ParentNode): HTMLElement[] {
  const roots = new Set<HTMLElement>();

  scope.querySelectorAll<HTMLHeadingElement>('h2').forEach((heading) => {
    if (heading.textContent?.trim() !== FEED_POST_HEADING) return;
    const root = heading.parentElement;
    if (root) roots.add(root);
  });

  scope.querySelectorAll<HTMLElement>(LEGACY_CARD_SELECTOR).forEach((card) => {
    roots.add(card);
  });

  return [...roots];
}

/**
 * True when `root` is a suggested post.
 *
 * LinkedIn labels these with a `<p>` whose entire text is "Suggested" (its child
 * `<span>` holds the word). Matching the paragraph's trimmed text exactly avoids
 * false positives from body copy that merely contains the word. Legacy markup put
 * the marker in the card header instead, so we check that too.
 */
export function isSuggestedPost(root: HTMLElement): boolean {
  for (const p of root.querySelectorAll('p')) {
    if (p.textContent?.trim() === SUGGESTED_LABEL) return true;
  }

  const legacyHeader = root.querySelector<HTMLElement>(
    '.update-components-header, .update-components-actor__description',
  );
  if (legacyHeader?.textContent?.trim().startsWith(SUGGESTED_LABEL)) return true;

  return false;
}

/**
 * True when `root` is a promoted (sponsored) post.
 *
 * LinkedIn labels these with a `<p>` whose text is either exactly "Promoted" or begins
 * "Promoted •" (e.g. "Promoted • Partnership with Example Co"). We match that label paragraph
 * and skip the post's expandable body text box (a `<p>` wrapping a
 * `[data-testid="expandable-text-box"]`), so body copy that happens to start with the word
 * "Promoted" never trips the filter.
 */
export function isPromotedPost(root: HTMLElement): boolean {
  for (const p of root.querySelectorAll<HTMLParagraphElement>('p')) {
    if (p.querySelector('[data-testid="expandable-text-box"]')) continue;
    const text = p.textContent?.trim() ?? '';
    if (text === 'Promoted' || /^Promoted\s*[•·]/.test(text)) return true;
  }
  return false;
}

/** Hide a post, remembering its previous inline display and why it was hidden so it can be restored. */
export function hidePost(el: HTMLElement, reason: string): void {
  if (el.dataset[HIDDEN_ATTR] === 'true') return;
  el.dataset[PREV_DISPLAY_ATTR] = el.style.display;
  el.dataset[REASON_ATTR] = reason;
  el.style.display = 'none';
  el.dataset[HIDDEN_ATTR] = 'true';
}

/** Reverse `hidePost`, restoring the element's original inline display. */
export function showPost(el: HTMLElement): void {
  if (el.dataset[HIDDEN_ATTR] !== 'true') return;
  el.style.display = el.dataset[PREV_DISPLAY_ATTR] ?? '';
  delete el.dataset[HIDDEN_ATTR];
  delete el.dataset[PREV_DISPLAY_ATTR];
  delete el.dataset[REASON_ATTR];
}

/** Hide every suggested post found in `scope`. Returns how many were newly hidden. */
export function hideSuggestedPosts(scope: ParentNode): number {
  let hidden = 0;
  for (const root of findFeedPostRoots(scope)) {
    if (root.dataset[HIDDEN_ATTR] === 'true') continue;
    if (isSuggestedPost(root)) {
      hidePost(root, SUGGESTED_REASON);
      hidden += 1;
    }
  }
  return hidden;
}

/** Hide every promoted post found in `scope`. Returns how many were newly hidden. */
export function hidePromotedPosts(scope: ParentNode): number {
  let hidden = 0;
  for (const root of findFeedPostRoots(scope)) {
    if (root.dataset[HIDDEN_ATTR] === 'true') continue;
    if (isPromotedPost(root)) {
      hidePost(root, PROMOTED_REASON);
      hidden += 1;
    }
  }
  return hidden;
}

/**
 * Restore posts this extension hid in `scope`. With no `reason`, restores every hidden post;
 * with a `reason`, restores only posts hidden for that reason. Returns the count restored.
 */
export function restoreHiddenPosts(scope: ParentNode, reason?: string): number {
  let restored = 0;
  scope.querySelectorAll<HTMLElement>(`[data-lip-hidden="true"]`).forEach((el) => {
    if (reason && el.dataset[REASON_ATTR] !== reason) return;
    showPost(el);
    restored += 1;
  });
  return restored;
}
