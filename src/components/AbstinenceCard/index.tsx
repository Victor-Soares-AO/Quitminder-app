import { View } from "react-native";
import { useEffect, useState } from "react";

import { FireIcon } from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";

import { calculateAbstinence } from "@/utils/calculateAbstinence";
import { useColors } from "@/hooks/useColors";
import { StyleSheet } from "react-native";

export function AbstinenceCard({ lastRelapseDate }) {
    const colors = useColors();
    const [abstinenceTime, setAbstinenceTime] = useState("0d 0h 0m 0s");

    // Atualiza o contador em tempo real
    useEffect(() => {
        const update = () => setAbstinenceTime(calculateAbstinence(lastRelapseDate));
        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [lastRelapseDate]);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            gap: 16,
            paddingVertical: 20,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: colors.background.secondary,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        cover: {
            width: 56,
            height: 56,
            borderRadius: 999,
            marginRight: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.gray[100]
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.cover}>
                    <FireIcon
                        size={28}
                        weight="fill"
                        color={colors.text.secondary}
                    />
                </View>

                <View>
                    <Title color="SECONDARY">
                        Tempo de abstinência
                    </Title>

                    <Heading>
                        {abstinenceTime}
                    </Heading>
                </View>
            </View>
        </View>
    )
}