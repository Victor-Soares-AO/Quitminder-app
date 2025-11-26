import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { IconProps, IconWeight } from "phosphor-react-native";

import { colors } from "@/theme";

import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    Icon: React.FC<IconProps>;
    IconWeight?: IconWeight;
}

export function IconButton({ Icon, IconWeight="fill", ...rest }: Props) {
    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.container}
            {...rest}    
        >
            <Icon 
                color={colors.gray[700]} 
                size={20} 
                weight={IconWeight} 
            />
        </TouchableOpacity>
    )
}