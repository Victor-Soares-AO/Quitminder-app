import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        backgroundColor: colors.background.secondary
    },
    wrapper: {

    },
    title: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
        marginLeft: 12,
        // borderWidth: 1,
        // borderColor: 'blue',
    },
    value: {
        // borderWidth: 1,
        // borderColor: 'red',
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
        fontFamily: fontFamily.medium,
    }
})