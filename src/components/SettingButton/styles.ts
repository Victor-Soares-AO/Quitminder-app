import { colors, fontFamily } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        // borderRadius: 20,
        backgroundColor: colors.background.secondary
    },
    cover: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        marginRight: 12
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.white
    }
})