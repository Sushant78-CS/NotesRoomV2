import { useThemeMode } from "@/store/themeStore";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallback() {
  const mode = useThemeMode();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: mode === "dark" ? "#000" : "#fff",
      }}
    >
      <ActivityIndicator
        size="large"
        color={mode === "dark" ? "#fff" : "#000"}
      />
    </View>
  );
}
