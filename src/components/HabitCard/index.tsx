import { useEffect, useState } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { FireIcon } from "phosphor-react-native";
import * as PhosphorIcons from "phosphor-react-native";

import { colors } from "@/theme";
import { styles } from "./styles";
import { Title } from "../Text/Title";
import { calculateAbstinence } from "@/utils/calculateAbstinence";

type Props = TouchableOpacityProps & {
    name: string;
    cover: string;
    color: string;
    lastRelapseDate: string;
}

export function HabitCard({ name, cover = 'StarIcon', color, lastRelapseDate, ...rest }: Props) {

    const IconComponent = PhosphorIcons[cover];
    const [abstinenceTime, setAbstinenceTime] = useState("0d 0h 0m 0s");

    // Atualiza o contador em tempo real
    useEffect(() => {
        const update = () => setAbstinenceTime(calculateAbstinence(lastRelapseDate));
        update(); // calcula imediatamente
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [lastRelapseDate]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            {...rest}
        >
            <View style={[styles.cover, { backgroundColor: color }]}>
                <IconComponent size={24} color="#fff" weight="fill" />
            </View>

            <View style={styles.wrapper}>
                <Title fontWeight="SEMIBOLD">
                    {name}
                </Title>

                <View style={styles.timeWrapper}>
                    <FireIcon color={colors.gray[700]} size={18} weight="fill" />

                    <Text style={styles.time} numberOfLines={1}>
                        Abstinência  •  {abstinenceTime}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// Abstinência  •  24d  18h  14m  25s