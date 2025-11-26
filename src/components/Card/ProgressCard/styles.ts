import { colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 16,
        backgroundColor: colors.background.secondary
    },
    icon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: colors.gray[100]
    }
});