import { useSyncExternalStore } from 'react';

export type SiteAppearance = 'light' | 'dark';

/*
  Bridges the page shell to the islands.

  The shell's color scheme lives in `<html data-theme>`, written by the pre-paint
  script in site.astro and by the Theme button. Every `ThemeProvider` below reads
  it through this store, so the day/night button re-themes the *rendered components*
  rather than just the CSS around them — which is the feature being advertised.

  `data-theme` is the only source of truth: the toggle writes it and persists the
  choice itself, so there is no second subscription to keep in sync.
*/

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): SiteAppearance =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/*
  Prerendering has no visitor and no preference, so the static HTML is always the
  light scheme; `useSyncExternalStore` re-renders each island the moment the client
  value arrives. That costs one painted frame inside the demos for a dark-preferring
  visitor — cheaper than a blank panel or a hydration mismatch.
*/
const getServerSnapshot = (): SiteAppearance => 'light';

export const useSiteAppearance = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
