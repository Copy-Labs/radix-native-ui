import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type ColorScheme = 'light' | 'dark';

/**
 * Hook to detect the device's color scheme preference
 */
export const useDeviceColorScheme = (): ColorScheme => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener((preferences) => {
      const scheme = preferences.colorScheme;
      setColorScheme(scheme === 'dark' ? 'dark' : 'light');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return colorScheme;
};

/**
 * Get the current color scheme synchronously
 */
export const getColorScheme = (): ColorScheme => {
  const scheme = Appearance.getColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
};

/**
 * Subscribe to color scheme changes
 */
export const addColorSchemeListener = (
  callback: (scheme: ColorScheme) => void
): (() => void) => {
  const subscription = Appearance.addChangeListener((preferences) => {
    callback(preferences.colorScheme === 'dark' ? 'dark' : 'light');
  });

  return () => subscription.remove();
};

export default useDeviceColorScheme;
