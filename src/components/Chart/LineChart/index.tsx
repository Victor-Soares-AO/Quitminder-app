import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fontFamily } from "@/theme";
import { BarChart } from "../BarChart";

type PointData = {
    label: string;
    value: number;
};

type Props = {
    data: PointData[];
    maxValue?: number;
    lineColor?: string;
    showValues?: boolean;
};

/**
 * LineChart simplificado - usa barras para mostrar evolução temporal
 * Mais simples e confiável que tentar desenhar linhas com Views
 */
export function LineChart({ data, maxValue, lineColor, showValues = true }: Props) {
    if (!data || data.length < 2) {
        const colorsTheme = useColors();
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colorsTheme.text.secondary }]}>
                    Dados insuficientes para exibir gráfico
                </Text>
            </View>
        );
    }

    // Converter para formato de barras para visualização mais simples
    const barData = data.map(item => ({
        label: item.label,
        value: item.value,
    }));

    return (
        <BarChart
            data={barData}
            maxValue={maxValue}
            barColor={lineColor}
            showValues={showValues}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
    },
});

