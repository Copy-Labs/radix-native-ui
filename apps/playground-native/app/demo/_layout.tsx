import { Stack } from 'expo-router';
import { ThemeProvider } from '@radix-ui/themes-native';

export default function DemoScreen() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'indigo', radius: 'medium', scaling: 1 }}
    >
      <Stack screenOptions={{
        headerShown: true,
        contentStyle: { flex: 1 },
        gestureEnabled: true,
        headerBackButtonDisplayMode: "default",
      }}>
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  )
}
