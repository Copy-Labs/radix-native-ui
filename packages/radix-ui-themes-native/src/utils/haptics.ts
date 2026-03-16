import { Platform, Vibration } from 'react-native';

/**
 * Haptic feedback types available
 */
export type HapticFeedbackType =
  | 'selection'
  | 'press'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

/**
 * Try to import expo-haptics, fallback to null if not available
 */
/*let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {
  // expo-haptics not installed, will use Vibration API fallback
}*/
let Haptics: any = null;
(async () => {
  try {
    Haptics = await import('expo-haptics');
  } catch {
    // expo-haptics not installed, will use Vibration API fallback
  }
})();

/**
 * Triggers haptic feedback with graceful fallback
 *
 * On iOS with expo-haptics:
 * - Uses Taptic Engine for precise, varied feedback (10-20ms)
 *
 * On Android or without expo-haptics:
 * - Falls back to basic vibration (10ms on Android, 400ms on iOS)
 *
 * @param type - The type of haptic feedback to trigger (default: 'selection')
 */
export const triggerHaptic = (type: HapticFeedbackType = 'selection'): void => {
  if (Haptics) {
    // Use expo-haptics for better iOS experience
    try {
      switch (type) {
        case 'selection':
          Haptics.selectionAsync();
          break;
        case 'press':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'impactLight':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'impactMedium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'impactHeavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'notificationSuccess':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'notificationWarning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'notificationError':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      // Silently fail - haptic feedback is a nice-to-have
      Platform.OS === 'android' ? Vibration.vibrate(10) : null;
    }
  } else {
    // Fallback to basic vibration
    Platform.OS === 'android' ? Vibration.vibrate(10) : null;
  }
};
