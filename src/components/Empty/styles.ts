import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 128,
        // backgroundColor: 'red',
        paddingHorizontal: 48
    },
    heading: {
        fontSize: 20,
        color: colors.white,
        fontFamily: fontFamily.semibold,
        textAlign: 'center',
        marginBottom: 8
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: fontFamily.medium,
        color: colors.gray[400],
        textAlign: 'center'
    }
});