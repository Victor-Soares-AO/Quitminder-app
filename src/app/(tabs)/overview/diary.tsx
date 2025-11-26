// import { SecondaryButton } from "@/components/SecondaryButton";
import { Header } from "@/components/Header";
import { colors } from "@/theme";
import { router } from "expo-router";
import { X } from "phosphor-react-native";
import { View, Text, StyleSheet } from "react-native";

export default function Diary() {
    return (
        <View style={styles.container}>
            <Header />
            {/* <SecondaryButton
                Icon={X}
                iconWeight="bold"
                onPress={() => router.back()}
            /> */}
            
            <Text style={styles.title}>
                Diário de Atividades
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
        fontSize: 18
    }
})