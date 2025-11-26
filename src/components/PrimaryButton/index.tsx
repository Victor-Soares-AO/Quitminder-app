import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { IconProps, IconWeight } from "phosphor-react-native";

import { styles } from "./styles";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    label: string;
    Icon?: React.FC<IconProps>;
    IconWeight?: IconWeight;
}

export function PrimaryButton({ label, Icon, IconWeight = "bold", ...rest }: Props) {
    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.container} 
            {...rest}
        >
            {Icon && <Icon color={colors.background.primary} size={18} weight={IconWeight} />}

            <Text style={styles.title}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}