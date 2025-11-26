import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 64,
        paddingHorizontal: 48
    },
    heading: {
        fontSize: 20,
        color: colors.text.secondary,
        fontFamily: fontFamily.semibold,
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 16
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: fontFamily.medium,
        color: colors.text.tertiary,
        textAlign: 'center'
    }
});