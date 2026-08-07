// ABOUTME: Content script that strips noise from the LinkedIn feed.
// ABOUTME: Runs on linkedin.com, hides suggested/promoted feed cards, re-runs as the feed lazy-loads.

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  runAt: 'document_idle',
  main() {
    // Text markers LinkedIn puts in a feed card's header for non-followed content.
    // These are the low-risk, high-signal ones to start with; the popup will make
    // each category toggleable in a later iteration.
    const NOISE_MARKERS = ['Suggested', 'Promoted'];

    const isNoiseCard = (card: HTMLElement): boolean => {
      const header = card.querySelector<HTMLElement>(
        '.update-components-header, .update-components-actor__description',
      );
      const label = header?.textContent?.trim() ?? '';
      return NOISE_MARKERS.some((marker) => label.startsWith(marker));
    };

    const purify = (): number => {
      const cards = document.querySelectorAll<HTMLElement>(
        'div.feed-shared-update-v2, div[data-id^="urn:li:activity"]',
      );
      let hidden = 0;
      cards.forEach((card) => {
        if (card.dataset.lipHidden === 'true') return;
        if (isNoiseCard(card)) {
          card.style.display = 'none';
          card.dataset.lipHidden = 'true';
          hidden += 1;
        }
      });
      return hidden;
    };

    // Initial pass, then keep up with LinkedIn's infinite scroll / SPA re-renders.
    purify();
    const observer = new MutationObserver(() => purify());
    observer.observe(document.body, { childList: true, subtree: true });
  },
});
