import { View, Text} from "react-native";
import { styles } from "./styles";

export function Empty(){
    return(
        <View style={styles.container}> 
            <Text style={styles.heading}>
                Let’s get started 🌀
            </Text>

            <Text style={styles.text}>
                Add your first addiction or bad habit using the + button.
            </Text>
        </View>
    )
}