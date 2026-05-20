import { syncUser } from "@/api/user";
import { useThemeMode } from "@/store/themeStore";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "../api/interceptors";
import { setupInterceptors } from "../api/interceptors";

function RootLayout() {
  const mode = useThemeMode();
  const barStyle = mode === "dark" ? "light-content" : "dark-content";

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const username = user.fullName || user.firstName || user.username || "User";

    const email = user.primaryEmailAddress?.emailAddress || "";

    syncUser(username, email);
  }, [user, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    setupInterceptors(getToken);
  }, [getToken, isLoaded]);

  if (!isLoaded) {
    return (
      <View
        style={{
          backgroundColor: mode === "dark" ? "#000" : "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          color={mode === "dark" ? "#fff" : "#000"}
          size="large"
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle={barStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="screens" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function InitialLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing publishable key");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayout />
    </ClerkProvider>
  );
}
