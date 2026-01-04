import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { GlassView } from 'expo-glass-effect';
import { IconProps, IconWeight } from "phosphor-react-native";

import { useColors } from "@/hooks/useColors";

import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    Icon: React.FC<IconProps>;
    IconWeight?: IconWeight;
}

export function IconButton({ Icon, IconWeight = "fill", ...rest }: Props) {
    const colors = useColors();
    
    return (
        <GlassView 
            isInteractive 
            glassEffectStyle="regular"
            style={styles.container}    
        >
            <TouchableOpacity
                activeOpacity={0.8}
                
                {...rest}
            >
                <Icon
                    color={colors.text.primary}
                    size={20}
                    weight={IconWeight}
                />
            </TouchableOpacity>
        </GlassView>
    )
}