// ABOUTME: Unit tests for the LinkedIn feed purify logic against real pasted LinkedIn markup.
// ABOUTME: Proves suggested posts are hidden, real posts are untouched, and toggling restores.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  findFeedPostRoots,
  isSuggestedPost,
  isPromotedPost,
  hideSuggestedPosts,
  hidePromotedPosts,
  restoreHiddenPosts,
  SUGGESTED_REASON,
  PROMOTED_REASON,
} from './purify';

const here = dirname(fileURLToPath(import.meta.url));
const suggestedHtml = readFileSync(join(here, '__fixtures__/suggested-post.html'), 'utf8');
const normalHtml = readFileSync(join(here, '__fixtures__/normal-post.html'), 'utf8');
const promotedHtml = readFileSync(join(here, '__fixtures__/promoted-post.html'), 'utf8');

/** Build a feed containing the given fixture HTML snippets. */
function buildFeed(...snippets: string[]): HTMLElement {
  const feed = document.createElement('div');
  feed.innerHTML = snippets.join('\n');
  document.body.innerHTML = '';
  document.body.appendChild(feed);
  return feed;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('findFeedPostRoots', () => {
  it('finds one root per feed post', () => {
    buildFeed(suggestedHtml, normalHtml);
    expect(findFeedPostRoots(document)).toHaveLength(2);
  });
});

describe('isSuggestedPost', () => {
  it('detects a real suggested post from LinkedIn markup', () => {
    buildFeed(suggestedHtml);
    const root = findFeedPostRoots(document)[0]!;
    expect(isSuggestedPost(root)).toBe(true);
  });

  it('does not flag a normal post, even when its body text contains the word "Suggested"', () => {
    buildFeed(normalHtml);
    const root = findFeedPostRoots(document)[0]!;
    expect(isSuggestedPost(root)).toBe(false);
  });
});

describe('isPromotedPost', () => {
  it('detects a real promoted post from its "Promoted • ..." label', () => {
    buildFeed(promotedHtml);
    const root = findFeedPostRoots(document)[0]!;
    expect(isPromotedPost(root)).toBe(true);
  });

  it('does not flag a normal or suggested post as promoted', () => {
    buildFeed(normalHtml, suggestedHtml);
    for (const root of findFeedPostRoots(document)) {
      expect(isPromotedPost(root)).toBe(false);
    }
  });

  it('ignores body copy that starts with "Promoted" in the expandable text box', () => {
    // A genuine post whose body opens with the word, not the sponsored label.
    buildFeed(`
      <div componentkey="x"><h2><span>Feed post</span></h2>
        <div><p><span>Jane Dev</span></p></div>
        <p><span tabindex="-1" data-testid="expandable-text-box">Promoted • my new book today!</span></p>
      </div>
    `);
    const root = findFeedPostRoots(document)[0]!;
    expect(isPromotedPost(root)).toBe(false);
  });
});

describe('hideSuggestedPosts / restoreHiddenPosts', () => {
  it('hides only the suggested post', () => {
    buildFeed(suggestedHtml, normalHtml);
    const roots = findFeedPostRoots(document);
    const suggested = roots[0]!;
    const normal = roots[1]!;

    const hidden = hideSuggestedPosts(document);

    expect(hidden).toBe(1);
    expect(suggested.style.display).toBe('none');
    expect(normal.style.display).not.toBe('none');
  });

  it('is idempotent: a second pass hides nothing new', () => {
    buildFeed(suggestedHtml, normalHtml);
    hideSuggestedPosts(document);
    expect(hideSuggestedPosts(document)).toBe(0);
  });

  it('restores a hidden post to its original display when the toggle is turned off', () => {
    buildFeed(suggestedHtml);
    const suggested = findFeedPostRoots(document)[0]!;
    suggested.style.display = 'flex'; // pretend LinkedIn had it laid out as flex

    hideSuggestedPosts(document);
    expect(suggested.style.display).toBe('none');

    const restored = restoreHiddenPosts(document);
    expect(restored).toBe(1);
    expect(suggested.style.display).toBe('flex');
    expect(suggested.dataset.lipHidden).toBeUndefined();
  });
});

describe('hidePromotedPosts with reason-scoped restore', () => {
  it('hides only the promoted post, leaving a normal post visible', () => {
    buildFeed(promotedHtml, normalHtml);
    const promoted = findFeedPostRoots(document)[0]!;
    const normal = findFeedPostRoots(document)[1]!;

    const hidden = hidePromotedPosts(document);

    expect(hidden).toBe(1);
    expect(promoted.style.display).toBe('none');
    expect(normal.style.display).not.toBe('none');
  });

  it('restores promoted posts without disturbing hidden suggested posts', () => {
    buildFeed(suggestedHtml, promotedHtml);
    hideSuggestedPosts(document);
    hidePromotedPosts(document);
    const suggested = findFeedPostRoots(document)[0]!;
    const promoted = findFeedPostRoots(document)[1]!;

    const restored = restoreHiddenPosts(document, PROMOTED_REASON);

    expect(restored).toBe(1);
    expect(promoted.style.display).not.toBe('none');
    expect(suggested.style.display).toBe('none');

    // And restoring the suggested reason clears the last one.
    expect(restoreHiddenPosts(document, SUGGESTED_REASON)).toBe(1);
    expect(suggested.style.display).not.toBe('none');
  });
});
