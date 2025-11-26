import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, Button } from "react-native";

import { styles } from "./styles";
import { Fire, Star } from "phosphor-react-native";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    title: string;
}

export function UpgradeButton({ title }: Props) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container}>
            <Fire 
                size={20} 
                weight="fill" 
                color={colors.white} 
            />

            {title && <Text style={styles.title}>{title}</Text>}
        </TouchableOpacity>
    )
}