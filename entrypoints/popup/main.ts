// ABOUTME: Popup entry point for the LinkedIn Purify toolbar button.
// ABOUTME: Placeholder UI; per-category toggles land here in a later iteration.
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="popup">
    <h1>LinkedIn Purify</h1>
    <p>Active on linkedin.com. Suggested and promoted feed cards are being hidden.</p>
    <p class="hint">Filter toggles are coming soon.</p>
  </main>
`;
