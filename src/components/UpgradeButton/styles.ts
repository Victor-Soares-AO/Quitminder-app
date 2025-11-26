import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#007AFF'
    },
    title: {
        color: colors.white,
        fontSize: 14,
        fontFamily: fontFamily.semibold
    }
});