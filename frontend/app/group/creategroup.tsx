import { createGroup } from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateGroup = () => {
  const router = useRouter();
  const mode = useThemeStore((s) => s.theme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;

  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setGroupNameError("Please enter group name");
      return;
    }

    setGroupNameError("");

    try {
      const res = await createGroup(groupName);
      setGroupName("");
      router.back();
    } catch (error) {
      console.log("error in create group api : ", error);
      Alert.alert("Error", "Failed to create group");
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: background }]}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View
            style={[
              styles.card,
              { backgroundColor: card, borderColor: primary },
            ]}
          >
            <Text style={[styles.heading, { color: text }]}>
              Create New Group
            </Text>
            <Text style={[styles.subHeading, { color: text }]}>
              Build your own group and invite members
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: text }]}>Group Name</Text>

              <TextInput
                placeholder="Enter group name"
                placeholderTextColor="#888"
                value={groupName}
                onChangeText={(text) => {
                  setGroupName(text);
                  setGroupNameError("");
                }}
                style={[
                  styles.input,
                  { borderColor: groupNameError ? "red" : "#888" },
                ]}
              />
              {groupNameError ? (
                <Text style={styles.errorText}>{groupNameError}</Text>
              ) : null}
            </View>
            <Pressable
              style={[styles.button, { backgroundColor: primary }]}
              onPress={handleCreateGroup}
            >
              <Text style={[styles.buttonText, { color: text }]}>
                Create Group
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={[styles.cancelText, { color: text }]}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 5,
  },

  subHeading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#222",
  },

  input: {
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelButton: {
    marginTop: 15,
    alignItems: "center",
  },

  cancelText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
