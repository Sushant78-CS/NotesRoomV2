import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeMode } from "@/store/themeStore";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    const mode = useThemeMode();
    const { background, text, card, primary } =
        mode === "dark" ? darkTheme : lightTheme;
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
                {icon}
                <View>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={[styles.infoValue, { color: text }]}>{value}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2e",
    },
    infoLeft: {
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
    },
    infoLabel: {
        color: "#71717a",
        fontSize: 10,
    },
    infoValue: {

        fontSize: 12,
        fontWeight: "500",
    },
});