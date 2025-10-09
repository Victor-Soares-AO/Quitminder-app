import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        width: 110,
        height: 40,
        padding: 10,
        backgroundColor: '#007AFF'
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: fontFamily.semibold
    }
});