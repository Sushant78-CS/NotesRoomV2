import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const GoogleButton = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleGooglePress = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",

        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "frontend",
          path: "auth-loader",
        }),
      });

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
        });

        console.log("Session created successfully");
        router.replace("/screens/home");
      }
    } catch (error) {
      console.log("Session creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handleGooglePress} style={styles.button}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View style={styles.iconTextContainer}>
          <Ionicons name="logo-google" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      )}
    </Pressable>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  button: {
    width: "88%",

    backgroundColor: "#000",

    paddingVertical: 14,

    borderRadius: 14,

    marginTop: 20,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",

    fontWeight: "700",

    fontSize: 16,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
