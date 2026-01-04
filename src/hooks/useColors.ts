import { useTheme } from "@/contexts/useTheme";
import { getColors } from "@/theme/getColors";

export function useColors() {
    const { isDark } = useTheme();
    return getColors(isDark);
}

