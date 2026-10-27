/**
 * Web stand-in for `expo-haptics`.
 *
 * The library only ever reaches this module through a guarded
 * `await import('expo-haptics')` inside a try/catch (see
 * `src/utils/haptics.ts`), falling back to `Vibration` when it is absent. On the
 * web there is no haptics at all, so every export here is a no-op — it exists so
 * the bundler can resolve the specifier instead of failing the build.
 */
const noop = () => Promise.resolve();

export const selectionAsync = noop;
export const impactAsync = noop;
export const notificationAsync = noop;
export const vibrate = noop;

export const ImpactFeedbackStyle = { Light: 'light', Medium: 'medium', Heavy: 'heavy' };
export const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};

export default {
  selectionAsync,
  impactAsync,
  notificationAsync,
  vibrate,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
};
