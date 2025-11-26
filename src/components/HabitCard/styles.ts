import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 16
    },
    cover: {
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapper: {
        flex: 1,
        gap: 4,
        marginLeft: 12,
    },
    time: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    }
})