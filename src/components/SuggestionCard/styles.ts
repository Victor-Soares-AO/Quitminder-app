import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 12
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#0A84FF'
    },
    title: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fontFamily.semibold
    }
});