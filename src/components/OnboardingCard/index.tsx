import { ColorValue, Text, View } from "react-native";
import { IconProps, IconWeight } from "phosphor-react-native";

import { styles } from "./styles";

import { colors } from "@/theme";

type Props = {
    heading: string;
    description: string;
    Icon: React.FC<IconProps>;
    iconWeight: IconWeight;
    backgroundColor: ColorValue;
}

export function OnboardingCard({ heading, description, Icon, iconWeight="fill", backgroundColor }: Props) {
    return (
        <View style={styles.container}>
            <View style={[styles.icon, { backgroundColor: backgroundColor }]}>
                <Icon color={colors.white} size={20} weight={iconWeight} />
            </View>

            <View style={styles.textWrapper}>
                <Text style={styles.heading}>
                    {heading}
                </Text>

                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
            </View>
        </View>
    )
}