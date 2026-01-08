import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { colors, fontFamily } from "@/theme";

type BarData = {
    label: string;
    value: number;
};

type Props = {
    data: BarData[];
    maxValue?: number;
    barColor?: string;
    showValues?: boolean;
};

export function BarChart({ data, maxValue, barColor, showValues = true }: Props) {
    const colorsTheme = useColors();
    
    if (!data || data.length === 0) {
        return null;
    }

    const max = maxValue || Math.max(...data.map(d => d.value));
    const hasData = data.some(d => d.value > 0);

    if (!hasData) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colorsTheme.text.secondary }]}>
                    Sem dados para exibir
                </Text>
            </View>
        );
    }

    const defaultBarColor = barColor || colorsTheme.gray[400];
    const chartHeight = 120;

    const styles = StyleSheet.create({
        container: {
            marginTop: 16,
            marginBottom: 8,
        },
        chartContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: chartHeight,
            gap: 8,
        },
        barWrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
        },
        bar: {
            width: '100%',
            backgroundColor: defaultBarColor,
            borderRadius: 4,
            minHeight: 4,
        },
        label: {
            fontSize: 11,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            textAlign: 'center',
        },
        value: {
            fontSize: 12,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            marginBottom: 4,
        },
        emptyContainer: {
            padding: 24,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                {data.map((item, index) => {
                    const heightPercent = max > 0 ? (item.value / max) : 0;
                    const barHeight = heightPercent * chartHeight;
                    
                    return (
                        <View key={index} style={styles.barWrapper}>
                            {showValues && item.value > 0 && (
                                <Text style={styles.value}>
                                    {item.value}
                                </Text>
                            )}
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max(barHeight, item.value > 0 ? 4 : 0),
                                    },
                                ]}
                            />
                            <Text style={styles.label} numberOfLines={1}>
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    chartContainer: {},
    barWrapper: {},
    bar: {},
    label: {},
    value: {},
    emptyContainer: {},
    emptyText: {},
});

