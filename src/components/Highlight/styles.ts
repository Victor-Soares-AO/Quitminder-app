import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 16
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    // habits: {
    //     fontSize: 20,
    //     fontFamily: fontFamily.semibold,
    //     color: colors.text.primary,
    // },
    label: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.gray[400],
    }
});