import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fontFamily } from "@/theme";

type BarData = {
    label: string;
    value: number;
};

type Props = {
    data: BarData[];
    maxValue?: number;
    barColor?: string;
    showValues?: boolean;
    compact?: boolean;
};

export function HorizontalBarChart({ data, maxValue, barColor, showValues = true, compact = false }: Props) {
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
    const barHeight = compact ? 20 : 24;
    const spacing = compact ? 8 : 12;

    const styles = StyleSheet.create({
        container: {
            marginTop: compact ? 12 : 16,
        },
        barItem: {
            marginBottom: spacing,
        },
        barRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        labelContainer: {
            width: compact ? 60 : 70,
        },
        label: {
            fontSize: compact ? 12 : 13,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
        },
        barContainer: {
            flex: 1,
            height: barHeight,
            backgroundColor: colorsTheme.gray[100],
            borderRadius: 4,
            overflow: 'hidden',
        },
        bar: {
            height: '100%',
            backgroundColor: defaultBarColor,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 6,
        },
        value: {
            fontSize: compact ? 11 : 12,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
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
            {data.map((item, index) => {
                const widthPercent = max > 0 ? (item.value / max) * 100 : 0;
                
                return (
                    <View key={index} style={styles.barItem}>
                        <View style={styles.barRow}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </View>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            width: `${widthPercent}%`,
                                        },
                                    ]}
                                >
                                    {showValues && item.value > 0 && widthPercent > 15 && (
                                        <Text style={styles.value}>
                                            {item.value}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            {showValues && item.value > 0 && widthPercent <= 15 && (
                                <Text style={styles.value}>
                                    {item.value}
                                </Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    barItem: {},
    barRow: {},
    labelContainer: {},
    label: {},
    barContainer: {},
    bar: {},
    value: {},
    emptyContainer: {},
    emptyText: {},
});

