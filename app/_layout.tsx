import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { AnimatedSplash } from '../src/components/AnimatedSplash';
import { AppThemeProvider, useAppTheme } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});
let animatedSplashShown = false;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>{(ready) => ready ? <AppShell /> : null}</AppThemeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { mode, colors } = useAppTheme();
  const [showSplash, setShowSplash] = useState(!animatedSplashShown);
  const finishSplash = () => {
    animatedSplashShown = true;
    setShowSplash(false);
  };
  useEffect(() => {
    if (!showSplash) {
      SplashScreen.hideAsync().catch(() => {});
      return;
    }
    const fallback = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      finishSplash();
    }, 10000);
    return () => clearTimeout(fallback);
  }, [showSplash]);
  const navigationTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={{
      ...navigationTheme,
      colors: {
        ...navigationTheme.colors,
        background: colors.background,
        card: colors.surface,
        border: colors.border,
        text: colors.text,
        primary: colors.accent,
      },
    }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <NavigationBar style={mode} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          navigationBarColor: colors.surface,
          animation: 'slide_from_right',
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="painting/[id]" />
          <Stack.Screen name="service/[slug]" />
          <Stack.Screen name="privacy" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="notifications" />
        </Stack>
        {showSplash && <AnimatedSplash onDone={finishSplash} />}
      </View>
    </ThemeProvider>
  );
}
