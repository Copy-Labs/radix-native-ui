import { Stack } from 'expo-router';
import { ThemeProvider } from 'radix-native-ui';

export default function LayoutScreen() {
  return (
    <ThemeProvider themeOptions={{ grayColor: 'sage', accentColor: 'lime', radius: 'full', scaling: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1 },
          gestureEnabled: true,
          headerBackButtonDisplayMode: 'default',
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
