import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        width: '100%',
        height: 56,
        backgroundColor: colors.white
    },
    title: {
        fontFamily: fontFamily.semibold,
        fontSize: 16
    }
});