import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        marginHorizontal: 16,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 20
    },
    cover: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#007AFF'
    },
    wrapper: {
        flex: 1,
        gap: 4,
        marginLeft: 12,
    },
    title: {
        color: colors.white,
        fontSize: 18,
        fontFamily: fontFamily.semibold
    },
    time: {
        color: colors.gray[400],
        fontSize: 14,
        fontFamily: fontFamily.medium
    }
})