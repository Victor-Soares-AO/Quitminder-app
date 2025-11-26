import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        minHeight: 128,
        backgroundColor: colors.background.secondary,
        borderRadius: 16,
        gap: 16
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})