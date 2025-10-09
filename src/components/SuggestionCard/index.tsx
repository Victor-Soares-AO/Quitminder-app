import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title
}

export function SuggestionCard({ title, ...rest }: Props) {
    return (
        <TouchableOpacity {...rest} activeOpacity={0.8} style={styles.container}>
            <View style={styles.icon}>

            </View>

            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}