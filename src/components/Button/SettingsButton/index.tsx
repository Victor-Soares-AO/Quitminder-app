import { ColorValue, Switch, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { Title } from "@/components/Text/Title";

import { styles } from "./styles";
import { CaretRightIcon, IconProps, IconWeight } from "phosphor-react-native";
import { Description } from "@/components/Text/Description";
import { colors } from "@/theme";

type Props = TouchableOpacityProps & {
    label: string;
    Icon: React.FC<IconProps>;
    iconWeight?: IconWeight;
    isSwitch?: boolean;
    iconBackground?: string;
}

export function SettingsButton({ label, Icon, iconWeight = "fill", isSwitch = false, iconBackground = "#1c1c1e", ...rest }: Props) {
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            <View style={styles.cover}>
                <Icon
                    color={iconBackground}
                    size={24}
                    weight={iconWeight}
                />
            </View>

            <View style={styles.content}>
                <Title>{label}</Title>
            </View>

            {isSwitch ? <Switch
                value={isSwitch}
                onValueChange={rest.onPress ? () => rest.onPress?.() : () => {}}
                trackColor={{ false: colors.gray[300], true: colors.blue }}
                thumbColor={colors.white}
            /> : <CaretRightIcon
                size={16}
                color={colors.text.secondary}
                weight="bold"
            />}
        </TouchableOpacity>
    )
}