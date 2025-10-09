import { colors } from "@/theme";
import { View, Text, StyleSheet} from "react-native";

export default function Statistic(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                Statistic
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