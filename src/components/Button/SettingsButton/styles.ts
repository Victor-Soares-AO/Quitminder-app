import { StyleSheet } from "react-native";

import { colors } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    cover: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
        height: 44,
        marginRight: 12,
        borderWidth: 1,
        borderRadius: 999,
        borderColor: colors.gray[100]
    },
    content: {
        flex: 1,
        gap: 4,
        marginRight: 12
    }
})