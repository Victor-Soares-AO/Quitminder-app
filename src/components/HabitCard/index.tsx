import { TouchableOpacity, Text, View, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";
import { CaretRightIcon } from "phosphor-react-native";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    title: string;
}

export function HabitCard({title, ...rest}:Props) {
    return (
        <TouchableOpacity {...rest} activeOpacity={0.8} style={styles.container}>
            <View style={styles.cover}>

            </View>

            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.time} numberOfLines={1}>
                    Abstinence  •  24d  18h  14m  25s
                </Text>
            </View>

            <CaretRightIcon 
                size={16}
                color="rgba(255,255,255,0.3)"
                weight="bold"  
            />
        </TouchableOpacity>
    )
}