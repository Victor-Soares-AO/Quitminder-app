import { View } from "react-native";
import { useEffect, useState } from "react";

import { FireIcon } from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";

import { colors } from "@/theme";
import { calculateAbstinence } from "@/utils/calculateAbstinence";

import { styles } from "./styles";

export function AbstinenceCard({ lastRelapseDate }) {

    const [abstinenceTime, setAbstinenceTime] = useState("0d 0h 0m 0s");

    // Atualiza o contador em tempo real
    useEffect(() => {
        const update = () => setAbstinenceTime(calculateAbstinence(lastRelapseDate));
        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [lastRelapseDate]);

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