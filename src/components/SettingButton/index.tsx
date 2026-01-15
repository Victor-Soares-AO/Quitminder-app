import React from "react";
import { Switch, TouchableOpacity, TouchableOpacityProps, Text, View, ColorValue } from "react-native";
import { styles } from "./styles";
import { CaretRightIcon, IconProps, IconWeight } from "phosphor-react-native";
import { colors } from "@/theme";
import { ChevronRight } from "lucide-react-native";

type Props = TouchableOpacityProps & {
    title: string;
    backgroundColor: ColorValue;
    Icon: React.FC<IconProps>;
    iconWeight?: IconWeight;
    rounded?: "top" | "bottom" | "full",
    isSwitch?: boolean;
}

export function SettingButton({ title, backgroundColor, Icon, iconWeight = "fill", rounded, isSwitch, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.container,
                { borderColor: colors.lineBorder },
                rounded === "full" && { borderRadius: 12 },
                rounded === "top" && { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
                rounded === "bottom" && { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
            ]}
            {...rest}
        >
            <View style={[styles.cover, { backgroundColor: backgroundColor }]}>
                <Icon
                    color="#FFFFFF"
                    size={20}
                    weight={iconWeight}
                />
            </View>

            <Text style={styles.title}>
                {title}
            </Text>

            <ChevronRight 
                size={20} 
                color={colors.text.secondary}
            />
        </TouchableOpacity>
    )
}