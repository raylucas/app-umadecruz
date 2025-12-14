import { SnackbarProvider } from "@/context/SnackbarContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { ActivityIndicator, Platform, StatusBar, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";


// Layout interno que não usa useUser()
function AppLayoutInner() {
  const insets = useSafeAreaInsets();
  const paddingTop = useMemo(
    () => (Platform.OS === "android" ? StatusBar.currentHeight ?? insets.top : insets.top),
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

// Wrapper que usa useUser() **após** UserProvider
function AppLayoutWrapper() {
  const { loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppLayoutInner />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <SnackbarProvider>
          <AppLayoutWrapper />
        </SnackbarProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}