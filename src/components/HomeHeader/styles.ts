import { colors, fontFamily } from "@/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 80
    },
    title: {
        color: colors.white,
        fontSize: 28,
        fontFamily: fontFamily.semibold
    },
    card: {
        width: "100%",
        height: 176,
        backgroundColor: colors.background.secondary,
        borderRadius: 16,
        marginTop: 24
    }
})