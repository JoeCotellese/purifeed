// ABOUTME: Unit tests for the reusable sidebar-module remover against real pasted LinkedIn markup.
// ABOUTME: Proves News and Puzzles modules are found by exact title, hidden and restored per-module,
// ABOUTME: that substring text does not false-positive, and that toggling one leaves the other alone.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  NEWS_TITLE,
  PUZZLES_TITLE,
  findSidebarModule,
  hideSidebarModule,
  restoreSidebarModule,
} from './sidebar';

const here = dirname(fileURLToPath(import.meta.url));
const newsHtml = readFileSync(join(here, '__fixtures__/linkedin-news.html'), 'utf8');
const puzzlesHtml = readFileSync(join(here, '__fixtures__/linkedin-puzzles.html'), 'utf8');
const otherModuleHtml = readFileSync(join(here, '__fixtures__/sidebar-other-module.html'), 'utf8');

/** Build a right rail containing the given fixture HTML snippets. */
function buildRail(...snippets: string[]): HTMLElement {
  const rail = document.createElement('aside');
  rail.innerHTML = snippets.join('\n');
  document.body.innerHTML = '';
  document.body.appendChild(rail);
  return rail;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('findSidebarModule', () => {
  it('finds the LinkedIn News module and returns its componentkey root', () => {
    buildRail(newsHtml);
    const root = findSidebarModule(document, NEWS_TITLE);
    expect(root).not.toBeNull();
    expect(root!.getAttribute('componentkey')).toBe('0f4eda46-ae2e-4d4a-bf5c-8d161d288ddb');
    expect(root!.textContent).toContain('Top stories');
    expect(root!.textContent).toContain('Show more news');
  });

  it('finds the Puzzles module by its curly-apostrophe title and wraps the whole widget', () => {
    buildRail(puzzlesHtml);
    const root = findSidebarModule(document, PUZZLES_TITLE);
    expect(root).not.toBeNull();
    expect(root!.getAttribute('componentkey')).toBe('feedRightNavGamesComponentRef');
    expect(root!.textContent).toContain('Zip');
    expect(root!.textContent).toContain('Show more');
  });

  it('returns null for a module whose title is not present', () => {
    buildRail(otherModuleHtml);
    expect(findSidebarModule(document, NEWS_TITLE)).toBeNull();
  });

  it('does not match on body copy that merely contains the title words', () => {
    buildRail(otherModuleHtml);
    expect(document.body.textContent).toContain('LinkedIn News');
    expect(findSidebarModule(document, NEWS_TITLE)).toBeNull();
  });
});

describe('hideSidebarModule / restoreSidebarModule', () => {
  it('hides only the requested module, leaving other modules visible', () => {
    buildRail(newsHtml, puzzlesHtml);
    const news = findSidebarModule(document, NEWS_TITLE)!;
    const puzzles = findSidebarModule(document, PUZZLES_TITLE)!;

    const hidden = hideSidebarModule(document, PUZZLES_TITLE);

    expect(hidden).toBe(1);
    expect(puzzles.style.display).toBe('none');
    expect(news.style.display).not.toBe('none');
  });

  it('is idempotent: a second hide of the same module hides nothing new', () => {
    buildRail(puzzlesHtml);
    hideSidebarModule(document, PUZZLES_TITLE);
    expect(hideSidebarModule(document, PUZZLES_TITLE)).toBe(0);
  });

  it('returns 0 when the module is not on the page', () => {
    buildRail(otherModuleHtml);
    expect(hideSidebarModule(document, NEWS_TITLE)).toBe(0);
  });

  it('restores a hidden module to its original display', () => {
    buildRail(puzzlesHtml);
    const puzzles = findSidebarModule(document, PUZZLES_TITLE)!;
    puzzles.style.display = 'flex'; // pretend LinkedIn had it laid out as flex

    hideSidebarModule(document, PUZZLES_TITLE);
    expect(puzzles.style.display).toBe('none');

    const restored = restoreSidebarModule(document, PUZZLES_TITLE);
    expect(restored).toBe(1);
    expect(puzzles.style.display).toBe('flex');
    expect(puzzles.dataset.lipModuleHidden).toBeUndefined();
  });

  it('restores only the named module, leaving the other still hidden', () => {
    buildRail(newsHtml, puzzlesHtml);
    hideSidebarModule(document, NEWS_TITLE);
    hideSidebarModule(document, PUZZLES_TITLE);
    const news = findSidebarModule(document, NEWS_TITLE)!;
    const puzzles = findSidebarModule(document, PUZZLES_TITLE)!;

    const restored = restoreSidebarModule(document, PUZZLES_TITLE);

    expect(restored).toBe(1);
    expect(puzzles.style.display).not.toBe('none');
    expect(news.style.display).toBe('none');
  });
});
