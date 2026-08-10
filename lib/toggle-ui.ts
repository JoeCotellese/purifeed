// ABOUTME: Binds a checkbox element to a boolean setting for the popup and options page.
// ABOUTME: Reflects stored value, writes changes, and stays live if the other surface flips it.
import { hideSuggested, hideNews, hidePuzzles, hidePromoted, hideAds } from './settings';

/** The slice of a WXT storage item this binding needs: read, write, and watch a boolean. */
interface BooleanSetting {
  getValue(): Promise<boolean>;
  setValue(value: boolean): Promise<void>;
  watch(cb: (value: boolean) => void): void;
}

/** Wire a checkbox to a boolean setting, keeping both in sync in both directions. */
export async function bindToggle(checkbox: HTMLInputElement, setting: BooleanSetting): Promise<void> {
  checkbox.checked = await setting.getValue();
  checkbox.addEventListener('change', () => {
    void setting.setValue(checkbox.checked);
  });
  // If the other surface (popup vs options) toggles it, mirror that here.
  setting.watch((next) => {
    checkbox.checked = next;
  });
}

/** Wire a checkbox to the "hide suggested posts" setting. */
export function bindHideSuggestedToggle(checkbox: HTMLInputElement): Promise<void> {
  return bindToggle(checkbox, hideSuggested);
}

/** Wire a checkbox to the "hide LinkedIn News" setting. */
export function bindHideNewsToggle(checkbox: HTMLInputElement): Promise<void> {
  return bindToggle(checkbox, hideNews);
}

/** Wire a checkbox to the "hide Today’s puzzles" setting. */
export function bindHidePuzzlesToggle(checkbox: HTMLInputElement): Promise<void> {
  return bindToggle(checkbox, hidePuzzles);
}

/** Wire a checkbox to the "hide promoted posts" setting. */
export function bindHidePromotedToggle(checkbox: HTMLInputElement): Promise<void> {
  return bindToggle(checkbox, hidePromoted);
}

/** Wire a checkbox to the "hide sidebar display ads" setting. */
export function bindHideAdsToggle(checkbox: HTMLInputElement): Promise<void> {
  return bindToggle(checkbox, hideAds);
}
