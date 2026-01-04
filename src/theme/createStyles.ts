import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { getColors } from "./getColors";
import { useTheme } from "@/contexts/useTheme";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function createStyles<T extends NamedStyles<T>>(
    stylesFn: (colors: ReturnType<typeof getColors>) => T
): () => T {
    return () => {
        const { isDark } = useTheme();
        const colors = getColors(isDark);
        return StyleSheet.create(stylesFn(colors));
    };
}

