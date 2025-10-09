import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 24
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    habits: {
        fontSize: 20,
        fontFamily: fontFamily.semibold,
        color: colors.white,
    },
    label: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.gray[400],
    }
});