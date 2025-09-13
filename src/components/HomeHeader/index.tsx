import { View, Text } from "react-native";
import { styles } from "./styles";

export function HomeHeader(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                QuitMinder
            </Text>

            {/* <View style={styles.card}>

            </View> */}
        </View>
    )
}