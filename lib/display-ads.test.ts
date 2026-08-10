// ABOUTME: Unit tests for the right-rail display-ad remover against real pasted LinkedIn markup.
// ABOUTME: Proves a sponsored creative is found by its URN, hidden and restored, and that a
// ABOUTME: normal post and a titled sidebar module are never mistaken for an ad.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { findDisplayAds, hideDisplayAds, restoreDisplayAds } from './display-ads';

const here = dirname(fileURLToPath(import.meta.url));
const adHtml = readFileSync(join(here, '__fixtures__/sidebar-display-ad.html'), 'utf8');
const adIframeHtml = readFileSync(join(here, '__fixtures__/display-ad-iframe.html'), 'utf8');
const normalPostHtml = readFileSync(join(here, '__fixtures__/normal-post.html'), 'utf8');
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

describe('findDisplayAds', () => {
  it('finds the sponsored creative container by its URN', () => {
    buildRail(adHtml);
    const ads = findDisplayAds(document);
    expect(ads).toHaveLength(1);
    expect(ads[0]!.getAttribute('data-creative')).toBe('urn:li:sponsoredCreative:1306413654');
    expect(ads[0]!.textContent).toContain("WHO'S WHO IN AMERICA");
  });

  it('finds the ad iframe by its "advertisement" title and skips LinkedIn\'s own iframe', () => {
    buildRail(adIframeHtml);
    const ads = findDisplayAds(document);
    expect(ads).toHaveLength(1);
    expect(ads[0]!.tagName).toBe('IFRAME');
    expect(ads[0]!.getAttribute('title')).toBe('advertisement');
  });

  it('does not treat a normal feed post as a display ad', () => {
    buildRail(normalPostHtml);
    expect(findDisplayAds(document)).toHaveLength(0);
  });

  it('does not treat a titled sidebar module as a display ad', () => {
    buildRail(otherModuleHtml);
    expect(findDisplayAds(document)).toHaveLength(0);
  });
});

describe('hideDisplayAds / restoreDisplayAds', () => {
  it('hides the ad and reports one newly hidden', () => {
    buildRail(adHtml);
    const ad = findDisplayAds(document)[0]!;
    expect(hideDisplayAds(document)).toBe(1);
    expect(ad.style.display).toBe('none');
  });

  it('does not double-count an already-hidden ad', () => {
    buildRail(adHtml);
    expect(hideDisplayAds(document)).toBe(1);
    expect(hideDisplayAds(document)).toBe(0);
  });

  it('restores the ad to its original inline display', () => {
    buildRail(adHtml);
    const ad = findDisplayAds(document)[0]!;
    ad.style.display = 'block';
    hideDisplayAds(document);
    expect(ad.style.display).toBe('none');
    expect(restoreDisplayAds(document)).toBe(1);
    expect(ad.style.display).toBe('block');
  });

  it('hides the ad iframe and reports one, leaving LinkedIn\'s own iframe visible', () => {
    buildRail(adIframeHtml);
    expect(hideDisplayAds(document)).toBe(1);
    const adFrame = document.querySelector<HTMLElement>('iframe[title="advertisement"]')!;
    const ownFrame = document.querySelector<HTMLElement>('iframe[title=""]')!;
    expect(adFrame.style.display).toBe('none');
    expect(ownFrame.style.display).toBe('');
  });

  it('leaves a normal post untouched', () => {
    buildRail(normalPostHtml);
    expect(hideDisplayAds(document)).toBe(0);
  });
});
