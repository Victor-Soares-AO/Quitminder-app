import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    // wrapper: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 16,
    //     gap: 8,
    // },
    title: {
        color: colors.gray[400],
        fontSize: 16,
        lineHeight: 24,
        fontFamily: fontFamily.medium
    },
    author: {
        color: colors.gray[400],
        fontSize: 14,
        fontFamily: fontFamily.medium,
        textAlign: 'right'
    },
    card: {
        width: "100%",
        minHeight: 128,
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 24,
        gap: 16
    },
})