import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeStore {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "light",
            setTheme: (theme: "light" | "dark" | "system") => set({ theme }),
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "theme",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const useThemeMode = () => {
    const selectedTheme = useThemeStore((s) => s.theme);
    const systemTheme = useColorScheme();
    return selectedTheme === "system" ? systemTheme || "dark" : selectedTheme;
}