import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import * as PhosphorIcons from "phosphor-react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string;
    icon?: string;
    color?: string;
}

export function SuggestionCard({ title, icon, color, style, ...rest }: Props) {
    const IconComponent = icon ? PhosphorIcons[icon] : null;

    return (
        <TouchableOpacity 
            {...rest} 
            activeOpacity={0.8} 
            style={[styles.container, style]}
        >
            {IconComponent && color && (
                <View style={[styles.icon, { backgroundColor: color }]}>
                    <IconComponent size={20} color="#fff" weight="fill" />
                </View>
            )}

            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}