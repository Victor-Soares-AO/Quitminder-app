import { colors, fontFamily } from "@/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 16
    },
    title: {
        color: colors.text.primary,
        fontSize: 28,
        fontFamily: fontFamily.semibold
    },
    wrapper: {
        flexDirection: 'row',
        gap: 12
    }
})