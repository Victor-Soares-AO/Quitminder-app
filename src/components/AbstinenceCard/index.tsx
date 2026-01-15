import { View } from "react-native";
import { useEffect, useState } from "react";

import { FireIcon, TireIcon } from "phosphor-react-native";

import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";

import { calculateAbstinence } from "@/utils/calculateAbstinence";
import { useColors } from "@/hooks/useColors";
import { StyleSheet } from "react-native";
import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { Description } from "../Text/Description";

type Props = {
    lastRelapseDate?: string | null; // Mantido para compatibilidade
    records?: HabitRecordResponse[]; // Prioridade: usar records para cálculo preciso
};

export function AbstinenceCard({ lastRelapseDate, records }: Props) {
    const colors = useColors();
    const [abstinenceTime, setAbstinenceTime] = useState("0d 0h 0m 0s");

    // Atualiza o contador em tempo real
    // PRIORIDADE: Se records for fornecido, calcular a partir dos registros reais
    // Isso garante que sempre use a recaída cronologicamente mais recente
    useEffect(() => {
        const update = () => {
            if (records && records.length > 0) {
                // Calcular a partir dos registros reais (sempre usa a recaída mais recente)
                setAbstinenceTime(calculateAbstinence(null, records));
            } else {
                // Fallback: usar lastRelapseDate se records não disponível
                setAbstinenceTime(calculateAbstinence(lastRelapseDate));
            }
        };
        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [lastRelapseDate, records]);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.background.secondary,
            borderWidth: 1,
            borderColor: colors.lineBorder,
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
    )
}