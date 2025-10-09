import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { IconProps } from "phosphor-react-native";

import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string;
    Icon?: React.FC<IconProps>;
}

export function PrimaryButton({ title, Icon, ...rest }: Props) {
    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.container} 
            {...rest}
        >
            {Icon && <Icon color="#000" size={20} weight="bold" />}

            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}