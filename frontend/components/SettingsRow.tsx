import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeMode } from "@/store/themeStore";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SettingsRow({ title }: { title: string }) {
    const mode = useThemeMode();
    const { text } = mode === "dark" ? darkTheme : lightTheme;
    return (
        <TouchableOpacity style={[styles.settingsRow]} activeOpacity={0.8}>
            <Text style={[styles.settingsText, { color: text }]}>{title}</Text>
            <Feather name="chevron-right" size={16} color={text} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    settingsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2e",
    },
    settingsText: {
        fontSize: 12,
    },
});