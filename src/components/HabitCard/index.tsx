import { useEffect, useState } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { FireIcon } from "phosphor-react-native";
import * as PhosphorIcons from "phosphor-react-native";

import { useColors } from "@/hooks/useColors";
import { Title } from "../Text/Title";
import { calculateAbstinence } from "@/utils/calculateAbstinence";
import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet } from "react-native";
import { fontFamily } from "@/theme";

type Props = TouchableOpacityProps & {
    name: string;
    cover: string;
    color: string;
    lastRelapseDate: string;
}

export function HabitCard({ name, cover = 'StarIcon', color, lastRelapseDate, ...rest }: Props) {
    const { t } = useTranslation();
    const colors = useColors();
    const IconComponent = PhosphorIcons[cover];
    const [abstinenceTime, setAbstinenceTime] = useState("0d 0h 0m 0s");
    
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background.secondary,
            marginHorizontal: 16,
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 20,
            borderRadius: 16
        },
        cover: {
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: '#007AFF',
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapper: {
            flex: 1,
            gap: 4,
            marginLeft: 12,
        },
        time: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colors.text.secondary
        },
        timeWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
        }
    });

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
                        {t("statistics.abstinence")}  •  {abstinenceTime}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// Abstinência  •  24d  18h  14m  25s