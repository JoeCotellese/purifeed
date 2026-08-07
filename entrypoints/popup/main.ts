// ABOUTME: Popup for the LinkedIn Purify toolbar button.
// ABOUTME: Quick toggle for hiding suggested posts, plus a link to the full settings page.
import './style.css';
import {
  bindHideSuggestedToggle,
  bindHideNewsToggle,
  bindHidePuzzlesToggle,
} from '../../lib/toggle-ui';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="popup">
    <h1>LinkedIn Purify</h1>
    <label class="row" for="hide-suggested">
      <span class="row-title">Hide suggested posts</span>
      <input type="checkbox" id="hide-suggested" class="switch" />
    </label>
    <label class="row" for="hide-news">
      <span class="row-title">Hide LinkedIn News</span>
      <input type="checkbox" id="hide-news" class="switch" />
    </label>
    <label class="row" for="hide-puzzles">
      <span class="row-title">Hide Today’s puzzles</span>
      <input type="checkbox" id="hide-puzzles" class="switch" />
    </label>
    <button type="button" id="open-settings" class="link">All settings</button>
  </main>
`;

void bindHideSuggestedToggle(document.querySelector<HTMLInputElement>('#hide-suggested')!);
void bindHideNewsToggle(document.querySelector<HTMLInputElement>('#hide-news')!);
void bindHidePuzzlesToggle(document.querySelector<HTMLInputElement>('#hide-puzzles')!);

document.querySelector<HTMLButtonElement>('#open-settings')!.addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});
