// Jest setup file for radix-native-ui
// @ts-nocheck

import '@testing-library/jest-native/extend-expect';

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
