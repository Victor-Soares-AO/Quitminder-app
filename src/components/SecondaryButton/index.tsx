import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { IconProps, IconWeight } from "phosphor-react-native";

import { styles } from "./styles";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    title?: string;
    Icon?: React.FC<IconProps>;
    iconWeight?: IconWeight;
}

export function SecondaryButton({ title, Icon, iconWeight="fill", ...rest }: Props) {
    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.container}
            {...rest}    
        >
            <Icon color={colors.gray[700]} size={20} weight={iconWeight} />

            {title && <Text style={styles.title}>{title}</Text>}
        </TouchableOpacity>
    )
}