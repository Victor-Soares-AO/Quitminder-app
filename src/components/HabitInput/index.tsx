import React from "react";
import { Switch, TouchableOpacity, TouchableOpacityProps, Text, View, ColorValue } from "react-native";
import { styles } from "./styles";
import { CaretRightIcon, IconProps, IconWeight } from "phosphor-react-native";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    title: string;
    value?: string;
    Icon: React.FC<IconProps>;
    iconWeight?: IconWeight;
    rounded?: "top" | "bottom" | "full",
    isSwitch?: boolean;
}

export function HabitInput({ title, value = 'Valor', Icon, iconWeight = "fill", rounded, isSwitch, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.container,
                rounded === "full" && { borderRadius: 16 },
                rounded === "top" && { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
                rounded === "bottom" && { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }
            ]}
            {...rest}
        >
            {/* <View style={styles.wrapper}> */}
                <Icon
                    color={colors.gray[1000]}
                    size={28}
                    weight={iconWeight}
                />

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.value}>
                    {value}
                </Text>
            {/* </View> */}
        </TouchableOpacity>
    )
}