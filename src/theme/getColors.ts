import { lightColors, darkColors } from "./colors";

export function getColors(isDark: boolean) {
    return isDark ? darkColors : lightColors;
}

