import { Platform, Vibration } from 'react-native';

/**
 * Haptic feedback types available
 */
export type HapticFeedbackType =
  | 'selection'
  | 'press'
  | 'toggleOn'
  | 'toggleOff'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

/**
 * Minimal shape of expo-haptics that we depend on. Kept loose on purpose:
 * expo-haptics is optional, so the library must build and run without it.
 */
type HapticsModule = {
  selectionAsync: () => Promise<void>;
  impactAsync: (style: unknown) => Promise<void>;
  notificationAsync: (type: unknown) => Promise<void>;
  /** Android-only. Uses the system haptic engine instead of the raw Vibrator. */
  performAndroidHapticsAsync?: (type: string) => Promise<void>;
  ImpactFeedbackStyle: {
    Light: unknown;
    Medium: unknown;
    Heavy: unknown;
  };
  NotificationFeedbackType: {
    Success: unknown;
    Warning: unknown;
    Error: unknown;
  };
};

/**
 * On Android, expo-haptics' `impactAsync`/`selectionAsync` are simulated with
 * the raw `Vibrator` (a 50 ms pulse for Light/Soft/selection), which feels
 * buzzy on many devices. `performAndroidHapticsAsync` uses the platform's
 * HapticFeedbackConstants instead — crisper, and no VIBRATE permission needed.
 * These strings are the values of expo-haptics' `AndroidHaptics` enum.
 */
const ANDROID_HAPTIC: Record<HapticFeedbackType, string> = {
  selection: 'segment-tick',
  press: 'context-click',
  toggleOn: 'toggle-on',
  toggleOff: 'toggle-off',
  impactLight: 'context-click',
  impactMedium: 'confirm',
  impactHeavy: 'confirm',
  notificationSuccess: 'confirm',
  notificationWarning: 'reject',
  notificationError: 'reject',
};

let cachedHaptics: HapticsModule | null | undefined;
let hapticsLoad: Promise<HapticsModule | null> | null = null;

/**
 * Resolve expo-haptics once and memoize the result.
 *
 * The previous implementation fired a fire-and-forget dynamic import at module
 * load. That made the first interaction use the Vibration fallback while later
 * ones used expo-haptics, which is especially noticeable on Android where the
 * two feedback mechanisms feel different.
 */
const getHaptics = (): Promise<HapticsModule | null> => {
  if (cachedHaptics !== undefined) {
    return Promise.resolve(cachedHaptics);
  }
  if (!hapticsLoad) {
    hapticsLoad = import('expo-haptics')
      .then((module) => {
        cachedHaptics = (module?.selectionAsync ? module : null) as HapticsModule | null;
        return cachedHaptics;
      })
      .catch(() => {
        cachedHaptics = null;
        return null;
      });
  }
  return hapticsLoad;
};

/**
 * Last-resort vibration when expo-haptics is unavailable or fails.
 * Kept Android-only to preserve the previous behaviour (no buzzing on iOS).
 */
const vibrateFallback = (): void => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(10);
  }
};

/**
 * A single press can be observed by more than one layer (for example a
 * compound trigger and the AnimatedPressable it renders). Collapse duplicate
 * press-like haptics that land in the same short window so the user feels one
 * confirmation instead of two. `selection` is intentionally not deduped:
 * sliders and drags use it as a per-step tick.
 */
const PRESS_DEDUPE_MS = 60;
const PRESS_LIKE: ReadonlyArray<HapticFeedbackType> = ['press', 'toggleOn', 'toggleOff'];
let lastPressAt = 0;

const shouldFire = (type: HapticFeedbackType): boolean => {
  if (!PRESS_LIKE.includes(type)) return true;
  const now = Date.now();
  if (now - lastPressAt < PRESS_DEDUPE_MS) return false;
  lastPressAt = now;
  return true;
};

/**
 * Triggers haptic feedback with graceful fallback.
 *
 * - Android: uses expo-haptics' `performAndroidHapticsAsync` (system haptic
 *   engine) when available, falling back to `impactAsync`/`selectionAsync`.
 * - iOS: uses the Taptic Engine via `impactAsync`/`selectionAsync`/
 *   `notificationAsync`.
 * - Without expo-haptics (or on failure): a short vibration on Android,
 *   silent on iOS.
 *
 * Fire-and-forget by design: haptics are a nice-to-have and must never block
 * or throw into the calling interaction.
 */
export const triggerHaptic = (type: HapticFeedbackType = 'selection'): void => {
  void getHaptics()
    .then((Haptics) => {
      if (!shouldFire(type)) return;
      if (!Haptics) {
        vibrateFallback();
        return;
      }

      const fire = (haptic: Promise<void> | void) => {
        // expo-haptics methods are async; a rejected promise must still fall
        // back instead of surfacing as an unhandled rejection. Test doubles
        // and the web shim are synchronous no-ops, so guard for that too.
        if (haptic && typeof (haptic as Promise<void>).catch === 'function') {
          void (haptic as Promise<void>).catch(vibrateFallback);
        }
      };

      try {
        // Prefer Android's native haptic engine over the raw Vibrator.
        if (Platform.OS === 'android' && typeof Haptics.performAndroidHapticsAsync === 'function') {
          fire(Haptics.performAndroidHapticsAsync(ANDROID_HAPTIC[type]));
          return;
        }

        // iOS (and older expo-haptics on Android): standard feedback styles.
        switch (type) {
          case 'selection':
            fire(Haptics.selectionAsync());
            break;
          case 'press':
          case 'toggleOn':
          case 'toggleOff':
          case 'impactLight':
            fire(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
            break;
          case 'impactMedium':
            fire(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
            break;
          case 'impactHeavy':
            fire(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
            break;
          case 'notificationSuccess':
            fire(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
            break;
          case 'notificationWarning':
            fire(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
            break;
          case 'notificationError':
            fire(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
            break;
        }
      } catch {
        vibrateFallback();
      }
    })
    .catch(vibrateFallback);
};
