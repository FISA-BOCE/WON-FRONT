import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/authColors';
import { getAuthTokens } from '@/hooks/authStorage';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const [fontsLoaded] = useFonts({});
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveAuth() {
      const tokens = await getAuthTokens();

      if (!isMounted) {
        return;
      }

      setHasToken(Boolean(tokens?.accessToken && tokens?.refreshToken));
      setIsAuthResolved(true);
    }

    resolveAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!isAuthResolved) {
      return;
    }

    const currentGroup = segments[0];
    const currentLeaf = segments[segments.length - 1];
    const isAuthRoute = currentGroup === '(auth)';
    const isTabsRoute = currentGroup === '(tabs)';
    const isAllowedUnauthRoute = currentLeaf === 'login' || currentLeaf === 'signup' || currentLeaf === 'signup-complete';

    if (!hasToken) {
      if (isTabsRoute || (isAuthRoute && !isAllowedUnauthRoute)) {
        router.replace('/login');
      }

      return;
    }

    if (isAuthRoute || pathname === '/') {
      router.replace('/card');
    }
  }, [hasToken, isAuthResolved, pathname, router, segments]);

  if (!fontsLoaded) return null;
  if (!isAuthResolved) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </View>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
});
