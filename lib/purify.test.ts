// ABOUTME: Unit tests for the LinkedIn feed purify logic against real pasted LinkedIn markup.
// ABOUTME: Proves suggested posts are hidden, real posts are untouched, and toggling restores.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  findFeedPostRoots,
  isSuggestedPost,
  hideSuggestedPosts,
  restoreHiddenPosts,
} from './purify';

const here = dirname(fileURLToPath(import.meta.url));
const suggestedHtml = readFileSync(join(here, '__fixtures__/suggested-post.html'), 'utf8');
const normalHtml = readFileSync(join(here, '__fixtures__/normal-post.html'), 'utf8');

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
