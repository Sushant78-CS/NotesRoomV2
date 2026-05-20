import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useThemeMode, useThemeStore } from "@/store/themeStore";
import { darkTheme, lightTheme } from "@/constants/theme";

export default function ThemeSelector() {
    const mode = useThemeMode();
    const currentTheme = useThemeStore((s) => s.theme);
    const setTheme = useThemeStore((s) => s.setTheme);

    const [expanded, setExpanded] = useState(false);

    const {
        background,
        text,
        card,
        primary,
    } = mode === "dark"
            ? darkTheme
            : lightTheme;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: card,
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.header}
                onPress={() => setExpanded(!expanded)}
            >
                <Text
                    style={[
                        styles.title,
                        {
                            color: text,
                        },
                    ]}
                >
                    Appearance
                </Text>

                <Feather
                    name={
                        expanded
                            ? "chevron-up"
                            : "chevron-down"
                    }
                    size={16}
                    color={text}
                />
            </TouchableOpacity>

            {expanded && (
                <>
                    <ThemeOption
                        icon={
                            <Feather
                                name="sun"
                                size={16}
                                color={text}
                            />
                        }
                        label="Light Theme"
                        active={currentTheme === "light"}
                        onPress={() =>
                            setTheme("light")
                        }
                        text={text}
                        primary={primary}
                    />

                    <Divider />

                    <ThemeOption
                        icon={
                            <Feather
                                name="moon"
                                size={16}
                                color={text}
                            />
                        }
                        label="Dark Theme"
                        active={currentTheme === "dark"}
                        onPress={() =>
                            setTheme("dark")
                        }
                        text={text}
                        primary={primary}
                    />

                    <Divider />

                    <ThemeOption
                        icon={
                            <Ionicons
                                name="phone-portrait-outline"
                                size={16}
                                color={text}
                            />
                        }
                        label="System Theme"
                        active={currentTheme === "system"}
                        onPress={() =>
                            setTheme("system")
                        }
                        text={text}
                        primary={primary}
                    />
                </>
            )}
        </View>
    );
}

function ThemeOption({
    icon,
    label,
    active,
    onPress,
    text,
    primary,
}: any) {
    return (
        <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.left}>
                {icon}

                <Text
                    style={[
                        styles.optionText,
                        {
                            color: text,
                        },
                    ]}
                >
                    {label}
                </Text>
            </View>

            <View
                style={[
                    styles.radioOuter,
                    {
                        borderColor: active
                            ? primary
                            : "#3f3f46",
                    },
                ]}
            >
                {active && (
                    <View
                        style={[
                            styles.radioInner,
                            {
                                backgroundColor:
                                    primary,
                            },
                        ]}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 14,
        marginTop: 14,
        borderRadius: 12,
        overflow: "hidden",
        paddingVertical: 2,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 14,
    },

    title: {
        fontSize: 12,
        fontWeight: "600",
    },

    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 16,
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    optionText: {
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 12,
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginHorizontal: 14,
    },

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 999,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
});