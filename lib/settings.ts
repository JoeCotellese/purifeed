// ABOUTME: Persisted extension settings, backed by WXT's cross-browser storage.
// ABOUTME: One place defines each toggle so popup, options page, and content script agree.
import { storage } from '#imports';

/**
 * Whether suggested feed posts are hidden. Defaults to `true`: hiding noise is the
 * whole point of the extension, so it works the moment it's installed. Stored in
 * `local` so it persists per-browser without a sign-in.
 */
export const hideSuggested = storage.defineItem<boolean>('local:hideSuggested', {
  fallback: true,
});

/**
 * Whether the right-rail "LinkedIn News" module is hidden. Independent of `hideSuggested`
 * so each can be toggled on its own. Defaults to `true` for the same reason: stripping
 * feed noise is the point. Stored in `local` so it persists per-browser without a sign-in.
 */
export const hideNews = storage.defineItem<boolean>('local:hideNews', {
  fallback: true,
});

/**
 * Whether the right-rail "Today’s puzzles" games module is hidden. Independent of the other
 * toggles so it can be flipped on its own. Defaults to `true`: stripping feed noise is the
 * point. Stored in `local` so it persists per-browser without a sign-in.
 */
export const hidePuzzles = storage.defineItem<boolean>('local:hidePuzzles', {
  fallback: true,
});

/**
 * Whether promoted (sponsored) posts are hidden from the feed. Independent of the other
 * toggles so it can be flipped on its own. Defaults to `true`: stripping ads is the point.
 * Stored in `local` so it persists per-browser without a sign-in.
 */
export const hidePromoted = storage.defineItem<boolean>('local:hidePromoted', {
  fallback: true,
});

/**
 * Whether right-rail display ads (sponsored creatives) are hidden. Independent of the other
 * toggles so it can be flipped on its own. Defaults to `true`: stripping ads is the point.
 * Stored in `local` so it persists per-browser without a sign-in.
 */
export const hideAds = storage.defineItem<boolean>('local:hideAds', {
  fallback: true,
});
