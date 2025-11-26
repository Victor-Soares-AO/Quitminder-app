import { colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: colors.background.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cover: {
        width: 56,
        height: 56,
        borderRadius: 999,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray[100]
    }
})