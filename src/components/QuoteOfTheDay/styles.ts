import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        minHeight: 128,
        backgroundColor: "#F5F5F7",
        borderRadius: 16,
        gap: 16,
        //backgroundColor: "#EBEBEB"
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})