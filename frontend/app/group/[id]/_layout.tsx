import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GroupDetailLayout = () => {
  const { id } = useLocalSearchParams();
  const mode = useThemeStore((s) => s.theme);
  const { activeTab, inactiveTab } = mode === "dark" ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === "dark" ? "#000" : "#fff",
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 10,
          height: 70 + insets.bottom,
        },
        tabBarActiveTintColor: activeTab,
        tabBarInactiveTintColor: inactiveTab,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ id }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(59,130,246,0.18)"
                  : "transparent",

                width: 52,
                height: 36,

                borderRadius: 14,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "document-text" : "document-text-outline"}
                size={26}
                color={focused ? "#3B82F6" : color}
              />
            </View>
          ),

          tabBarLabel: "Notes",
        }}
      />

      <Tabs.Screen
        name="members"
        initialParams={{ id }}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(59,130,246,0.18)"
                  : "transparent",

                width: 52,
                height: 36,

                borderRadius: 14,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={26}
                color={focused ? "#3B82F6" : color}
              />
            </View>
          ),

          tabBarLabel: "Members",
        }}
      />
    </Tabs>
  );
};

export default GroupDetailLayout;
