import { SecondaryButton } from "@/components/SecondaryButton";
import { colors } from "@/theme";
import { router } from "expo-router";
import { X } from "phosphor-react-native";
import { View, Text, StyleSheet } from "react-native";

export default function Reasons() {
    return (
        <View style={styles.container}>
            <SecondaryButton
                Icon={X}
                iconWeight="bold"
                onPress={() => router.back()}
            />
            
            <Text style={styles.title}>
                Reasons
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary
    },
    title: {
        color: colors.white,
        fontSize: 18
    }
})