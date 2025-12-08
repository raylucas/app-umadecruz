import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Platform, StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function AppLayoutInner() {
  const insets = useSafeAreaInsets();

  const paddingTop = useMemo(
    () =>
      Platform.OS === "android"
        ? StatusBar.currentHeight ?? insets.top
        : insets.top,
    [insets.top]
  );

  return (
    <PaperProvider>
      <ExpoStatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { paddingTop },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppLayoutInner />
      </UserProvider>
    </SafeAreaProvider>
  );
}
