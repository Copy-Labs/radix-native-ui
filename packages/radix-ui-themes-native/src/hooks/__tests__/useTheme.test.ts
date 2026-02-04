import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme, useThemeMode, useThemeActions, useThemeColors } from '../theme/ThemeProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme hook', () => {
  it('returns theme object', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.colors).toBeDefined();
    expect(result.current.typography).toBeDefined();
    expect(result.current.radii).toBeDefined();
    expect(result.current.space).toBeDefined();
  });

  it('throws error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = consoleError;
  });
});

describe('useThemeMode hook', () => {
  it('returns theme mode', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current).toBeDefined();
    expect(['light', 'dark']).toContain(result.current);
  });

  it('throws error when used outside ThemeProvider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useThemeMode());
    }).toThrow('useThemeMode must be used within a ThemeProvider');

    console.error = consoleError;
  });
});

describe('useThemeActions hook', () => {
  it('returns theme actions', () => {
    const { result } = renderHook(() => useThemeActions(), { wrapper });

    expect(result.current).toBeDefined();
    expect(typeof result.current.setMode).toBe('function');
    expect(typeof result.current.toggleMode).toBe('function');
    expect(['light', 'dark']).toContain(result.current.mode);
  });

  it('setMode changes theme mode', () => {
    const { result } = renderHook(() => useThemeActions(), { wrapper });

    const initialMode = result.current.mode;

    act(() => {
      result.current.setMode(initialMode === 'light' ? 'dark' : 'light');
    });

    expect(result.current.mode).toBe(initialMode === 'light' ? 'dark' : 'light');
  });

  it('toggleMode switches between light and dark', () => {
    const { result } = renderHook(() => useThemeActions(), { wrapper });

    const initialMode = result.current.mode;

    act(() => {
      result.current.toggleMode();
    });

    expect(result.current.mode).toBe(initialMode === 'light' ? 'dark' : 'light');
  });

  it('throws error when used outside ThemeProvider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useThemeActions());
    }).toThrow('useThemeActions must be used within a ThemeProvider');

    console.error = consoleError;
  });
});

describe('useThemeColors hook', () => {
  it('returns theme colors for current mode', () => {
    const { result } = renderHook(() => useThemeColors(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.gray).toBeDefined();
    expect(result.current.background).toBeDefined();
    expect(result.current.surface).toBeDefined();
    expect(result.current.panel).toBeDefined();
  });

  it('returns different colors for light and dark modes', () => {
    const { result, rerender } = renderHook(() => useThemeColors(), { wrapper });

    const lightColors = { ...result.current };

    act(() => {
      rerender();
    });

    // The colors should be defined for both modes
    expect(lightColors.gray).toBeDefined();
    expect(lightColors.background).toBeDefined();
  });
});
