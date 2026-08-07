// ABOUTME: Options (configuration) page for LinkedIn Purify.
// ABOUTME: Renders the filter toggles and binds them to persisted settings.
import './style.css';
import {
  bindHideSuggestedToggle,
  bindHideNewsToggle,
  bindHidePuzzlesToggle,
  bindHidePromotedToggle,
} from '../../lib/toggle-ui';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="settings">
    <header class="brand">
      <img class="brand-icon" src="/icon/48.png" alt="" width="32" height="32" />
      <div>
        <h1>Purifeed</h1>
        <p class="tagline">Choose what to strip from your feed.</p>
      </div>
    </header>

    <section class="filters">
      <label class="filter" for="hide-suggested">
        <span class="filter-text">
          <span class="filter-title">Hide suggested posts</span>
          <span class="filter-desc">Remove "Suggested" posts from people and pages you don't follow.</span>
        </span>
        <input type="checkbox" id="hide-suggested" class="switch" />
      </label>
      <label class="filter" for="hide-promoted">
        <span class="filter-text">
          <span class="filter-title">Hide promoted posts</span>
          <span class="filter-desc">Remove sponsored "Promoted" ads from the feed.</span>
        </span>
        <input type="checkbox" id="hide-promoted" class="switch" />
      </label>
      <label class="filter" for="hide-news">
        <span class="filter-text">
          <span class="filter-title">Hide LinkedIn News</span>
          <span class="filter-desc">Remove the right-rail "LinkedIn News" / "Top stories" module.</span>
        </span>
        <input type="checkbox" id="hide-news" class="switch" />
      </label>
      <label class="filter" for="hide-puzzles">
        <span class="filter-text">
          <span class="filter-title">Hide Today’s puzzles</span>
          <span class="filter-desc">Remove the right-rail games module (Zip, Wend, Mini Sudoku, and the rest).</span>
        </span>
        <input type="checkbox" id="hide-puzzles" class="switch" />
      </label>
    </section>

    <footer>
      <div class="support">
        <a class="coffee" href="https://buymeacoffee.com/joecotellese" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 9h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path d="M17 10h2a2 2 0 0 1 0 4h-2" />
            <path d="M7 4v2M11 4v2" />
          </svg>
          Buy me a coffee
        </a>
        <a class="feature-link" href="https://github.com/JoeCotellese/purifeed/issues/new" target="_blank" rel="noopener noreferrer">Request a feature →</a>
      </div>
      <p class="hint">Changes apply to open LinkedIn tabs right away.</p>
      <p class="trust">
        <span id="version"></span>
        Not affiliated with LinkedIn or Microsoft. Purifeed collects no data and
        makes no network requests.
        <a href="https://github.com/JoeCotellese/purifeed/blob/main/PRIVACY.md" target="_blank" rel="noopener noreferrer">Privacy</a>
      </p>
    </footer>
  </main>
`;

const version = browser.runtime.getManifest().version;
document.querySelector<HTMLSpanElement>('#version')!.textContent = `v${version} · `;

void bindHideSuggestedToggle(document.querySelector<HTMLInputElement>('#hide-suggested')!);
void bindHidePromotedToggle(document.querySelector<HTMLInputElement>('#hide-promoted')!);
void bindHideNewsToggle(document.querySelector<HTMLInputElement>('#hide-news')!);
void bindHidePuzzlesToggle(document.querySelector<HTMLInputElement>('#hide-puzzles')!);
