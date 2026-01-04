import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_COLLECTION = '@QuitMinder:theme';

type ThemeContextData = {
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextData>({
    themeMode: "auto",
    isDark: false,
    setThemeMode: async () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        // Atualizar tema baseado no modo e no sistema
        if (themeMode === "auto") {
            setIsDark(systemColorScheme === "dark");
        } else {
            setIsDark(themeMode === "dark");
        }
    }, [themeMode, systemColorScheme]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_COLLECTION);
            if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "auto")) {
                setThemeModeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error("Erro ao carregar tema:", error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_COLLECTION, mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error("Erro ao salvar tema:", error);
            throw error;
        }
    };

    return (
        <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}

