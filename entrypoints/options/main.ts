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
    <header>
      <h1>LinkedIn Purify</h1>
      <p class="tagline">Choose what to strip from your feed.</p>
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
      <p class="hint">Changes apply to open LinkedIn tabs right away.</p>
    </footer>
  </main>
`;

void bindHideSuggestedToggle(document.querySelector<HTMLInputElement>('#hide-suggested')!);
void bindHidePromotedToggle(document.querySelector<HTMLInputElement>('#hide-promoted')!);
void bindHideNewsToggle(document.querySelector<HTMLInputElement>('#hide-news')!);
void bindHidePuzzlesToggle(document.querySelector<HTMLInputElement>('#hide-puzzles')!);
