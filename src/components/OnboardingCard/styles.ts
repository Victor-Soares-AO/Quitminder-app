import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        // width: '100%',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: colors.background.secondary,
         flexShrink: 1
    },
    icon: {
        // flex: 1,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderRadius: 999,
        backgroundColor: 'red'
    },
    textWrapper: {
        flex: 1,
        gap: 4,
        // borderWidth: 1,
        // borderColor: 'red',
    },
    heading: {
        fontSize: 16,
        fontFamily: fontFamily.semibold,
        color: colors.text.primary
    },
    description: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary
    }
});