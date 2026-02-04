// Jest setup file for @radix-ui/themes-native
// @ts-nocheck

import '@testing-library/jest-native/extend-expect';

// Mock React Native
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (style: any) => style,
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TextInput: 'TextInput',
  Image: 'Image',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  ActivityIndicator: 'ActivityIndicator',
  Platform: {
    OS: 'ios',
    select: (obj: any) => obj.ios,
  },
  Dimensions: {
    get: (name: string) => {
      if (name === 'window') {
        return { width: 375, height: 812 };
      }
      return { width: 375, height: 812 };
    },
  },
  PixelRatio: {
    get: () => 2,
  },
}));

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-font or any font-related modules
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
}));

// Extend Jest with custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeNull(): R;
      toEqual(expected: any): R;
      toContain(substring: string): R;
      toHaveTextContent(text: string): R;
    }
  }
}

// Global test timeout
jest.setTimeout(10000);

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('act()'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('act()'))
  ) {
    return;
  }
  originalError.apply(console, args);
};
