import ProfileRow from "@/components/ProfileRow";
import SettingsRow from "@/components/SettingsRow";
import ThemeSelector from "@/components/ThemeSelector";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeMode } from "@/store/themeStore";
import { useAuth, useUser } from "@clerk/expo";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.2;

export default function Index() {
  const mode = useThemeMode();
  const { background, text, card, primary } =
    mode === "dark" ? darkTheme : lightTheme;

  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerCard, { backgroundColor: primary }]}>
        <View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { backgroundColor: mode === "dark" ? "#3e3b3bff" : "#e4e4e7" },
            ]}
          >
            <Feather
              name="chevron-left"
              size={20}
              color={mode === "dark" ? "#fff" : primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerOverlay} />

        <View style={styles.headerContent}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: mode === "dark" ? "#3e3b3bff" : "#e4e4e7",
              },
            ]}
          >
            <Feather
              name="user"
              size={26}
              color={mode === "dark" ? "#fff" : primary}
            />
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: card }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Your Information
        </Text>

        <ProfileRow
          icon={<Feather name="mail" size={16} color={primary} />}
          label="Email"
          value={user?.primaryEmailAddress?.emailAddress || "Unknown"}
        />

        <ProfileRow
          icon={<Feather name="user" size={16} color={primary} />}
          label="Full Name"
          value={user?.username || user?.fullName || "Unknown"}
        />

        <ProfileRow
          icon={<Feather name="shield" size={16} color={primary} />}
          label="Account Status"
          value="Active"
        />
      </View>

      <ThemeSelector />

      <View style={[styles.section, { backgroundColor: card }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>Preferences</Text>
        <TouchableOpacity>
          <SettingsRow title="Notification Preferences" />
        </TouchableOpacity>
        <TouchableOpacity>
          <SettingsRow title="Terms & Conditions" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={16} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>NotesRoom v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
  },

  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#202124",
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "600",
  },

  email: {
    color: "#fff",
    marginTop: 2,
    fontSize: 11,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },

  quickCard: {
    width: "40%",
    backgroundColor: "#2a2a2e",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  quickLabel: {
    color: "#e4e4e7",
    fontSize: 12,
    fontWeight: "500",
  },

  section: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: "#202124",
    borderRadius: 12,
    paddingVertical: 6,
  },

  sectionTitle: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    paddingHorizontal: 10,
  },

  logoutBtn: {
    marginHorizontal: 14,
    marginTop: 18,
    backgroundColor: "#c42727ff",
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  logoutText: {
    color: "#f4f4f5",
    fontSize: 13,
    fontWeight: "600",
  },

  version: {
    color: "#71717a",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 24,
    fontSize: 11,
  },
  headerCard: {
    borderRadius: 28,
    overflow: "hidden",
    padding: 22,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  headerOverlay: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    marginTop: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
