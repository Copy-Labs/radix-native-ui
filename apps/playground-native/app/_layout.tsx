// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider, useTheme, useThemeActions, useThemeMode } from 'radix-native-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const theme = useTheme();
  const mode = useThemeMode();
  const backgroundColor = mode === 'dark' ? theme.colors.gray.dark[2] : theme.colors.gray[2];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="demo" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={backgroundColor} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      accentColor="indigo"
      radius="large"
      scaling={1}
    >
      <AppContent />
    </ThemeProvider>
  );
}
