import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string;
}

export function PrimaryButton({ title }: Props) {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}