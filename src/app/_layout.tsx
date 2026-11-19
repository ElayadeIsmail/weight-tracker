import { useResolvedColorScheme, useTheme } from "@/hooks/use-theme";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { ThemeProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, View } from "react-native";
import { DarkNavTheme, LightNavTheme } from "@/theme/navigation";
import { StatusBar } from "expo-status-bar";
import { LoadingState } from "@/components/ui/loading-state";
import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  useAuthBootstrap();
  const fontsReady = useAppFonts();
  const colors = useTheme();
  const resolvedScheme = useResolvedColorScheme();

  if (!fontsReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <LoadingState flex />
      </View>
    );
  }

  return (
    <ThemeProvider
      value={resolvedScheme === "dark" ? DarkNavTheme : LightNavTheme}
    >
      <QueryClientProvider client={queryClient}>
        <View style={[styles.root, { backgroundColor: colors.background }]}>
          <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="verify" />
            <Stack.Screen name="auth/callback" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
  },
});
