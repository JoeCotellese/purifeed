// ABOUTME: Content script that strips noise from the LinkedIn feed: suggested posts and the news module.
// ABOUTME: Applies the saved toggles on load, follows infinite scroll, and reacts to toggle changes live.
import { hideSuggested, hideNews, hidePuzzles } from '../lib/settings';
import { hideSuggestedPosts, restoreHiddenPosts } from '../lib/purify';
import {
  NEWS_TITLE,
  PUZZLES_TITLE,
  hideSidebarModule,
  restoreSidebarModule,
} from '../lib/sidebar';

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  runAt: 'document_idle',
  async main() {
    let suggestedEnabled = await hideSuggested.getValue();
    let newsEnabled = await hideNews.getValue();
    let puzzlesEnabled = await hidePuzzles.getValue();

    // Coalesce the bursts of mutations LinkedIn fires while rendering into one pass per frame.
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    };

    const applyModule = (title: string, enabled: boolean) => {
      if (enabled) hideSidebarModule(document, title);
      else restoreSidebarModule(document, title);
    };

    const apply = () => {
      if (suggestedEnabled) hideSuggestedPosts(document);
      else restoreHiddenPosts(document);

      applyModule(NEWS_TITLE, newsEnabled);
      applyModule(PUZZLES_TITLE, puzzlesEnabled);
    };

    apply();

    // Keep up with the infinite scroll and SPA re-renders that add feed cards over time.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    // Flip immediately when a toggle changes in the popup or options page, no reload needed.
    hideSuggested.watch((next) => {
      suggestedEnabled = next;
      apply();
    });
    hideNews.watch((next) => {
      newsEnabled = next;
      apply();
    });
    hidePuzzles.watch((next) => {
      puzzlesEnabled = next;
      apply();
    });
  },
});
