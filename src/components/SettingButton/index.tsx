import React from "react";
import { Switch, TouchableOpacity, TouchableOpacityProps, Text, View, ColorValue } from "react-native";
import { styles } from "./styles";
import { CaretRightIcon, IconProps, IconWeight } from "phosphor-react-native";

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
                rounded === "full" && { borderRadius: 20 },
                rounded === "top" && { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                rounded === "bottom" && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
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

            {isSwitch
                ? <Switch />
                : <CaretRightIcon size={16} color="rgba(255,255,255,0.3)" weight="bold" />
            }
        </TouchableOpacity>
    )
}