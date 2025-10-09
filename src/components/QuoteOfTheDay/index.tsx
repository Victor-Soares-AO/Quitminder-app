import { Text, View } from "react-native";
import { Quotes } from "phosphor-react-native";

import { styles } from "./styles";
import { colors } from "@/theme";

export function QuoteOfTheDay() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    Frase do dia
                </Text>

                <Text style={styles.title}>
                    O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.
                </Text>

                <Text style={styles.author}>
                    @Winston Churchill
                </Text>
            </View>
        </View>
    )
}