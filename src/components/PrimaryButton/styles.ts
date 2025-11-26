import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        width: '100%',
        height: 56,
        backgroundColor: colors.button.primary
    },
    title: {
        fontSize: 16,
        fontFamily: fontFamily.semibold,
        color: colors.background.primary
    }
});