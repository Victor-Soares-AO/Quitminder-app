import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fontFamily } from "@/theme";

type PointData = {
    label?: string;
    value: number;
};

type Props = {
    data: PointData[];
    maxValue?: number;
    minValue?: number;
    lineColor?: string;
    showLabels?: boolean;
    compact?: boolean;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64; // Considerando padding do card

export function Sparkline({ data, maxValue, minValue, lineColor, showLabels = false, compact = false }: Props) {
    const colorsTheme = useColors();
    
    if (!data || data.length < 2) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colorsTheme.text.secondary }]}>
                    Dados insuficientes
                </Text>
            </View>
        );
    }

    const max = maxValue || Math.max(...data.map(d => d.value));
    const min = minValue !== undefined ? minValue : Math.min(...data.map(d => d.value));
    const range = max - min || 1;

    const defaultLineColor = lineColor || colorsTheme.gray[400];
    const chartHeight = compact ? 40 : 60;
    const pointRadius = compact ? 3 : 4;

    // Calcular posições dos pontos
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * CHART_WIDTH;
        const y = chartHeight - ((item.value - min) / range) * chartHeight;
        return { ...item, x, y, index };
    });

    const styles = StyleSheet.create({
        container: {
            marginTop: compact ? 8 : 12,
        },
        chartContainer: {
            height: chartHeight,
            width: CHART_WIDTH,
            position: 'relative',
        },
        line: {
            position: 'absolute',
            height: 2,
            backgroundColor: defaultLineColor,
        },
        point: {
            position: 'absolute',
            width: pointRadius * 2,
            height: pointRadius * 2,
            borderRadius: pointRadius,
            backgroundColor: defaultLineColor,
            borderWidth: 2,
            borderColor: colorsTheme.background.secondary,
            marginLeft: -pointRadius,
            marginTop: -pointRadius,
        },
        labelsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        label: {
            fontSize: 10,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
        },
        emptyContainer: {
            padding: 16,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 12,
            fontFamily: fontFamily.medium,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                {/* Linhas conectando os pontos usando SVG-like approach com Views */}
                {points.map((point, index) => {
                    if (index === points.length - 1) return null;
                    
                    const nextPoint = points[index + 1];
                    const dx = nextPoint.x - point.x;
                    const dy = nextPoint.y - point.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    
                    return (
                        <View
                            key={`line-${index}`}
                            style={[
                                styles.line,
                                {
                                    left: point.x,
                                    top: point.y - 1,
                                    width: length,
                                    transform: [{ rotate: `${angle}deg` }],
                                },
                            ]}
                        />
                    );
                })}
                
                {/* Pontos */}
                {points.map((point, index) => (
                    <View
                        key={`point-${index}`}
                        style={[
                            styles.point,
                            {
                                left: point.x,
                                top: point.y,
                            },
                        ]}
                    />
                ))}
            </View>
            
            {/* Labels opcionais */}
            {showLabels && data[0].label && (
                <View style={styles.labelsContainer}>
                    {data.map((item, index) => {
                        if (index === 0 || index === data.length - 1) {
                            return (
                                <Text key={index} style={styles.label} numberOfLines={1}>
                                    {item.label || ''}
                                </Text>
                            );
                        }
                        return <View key={index} />;
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    chartContainer: {},
    line: {},
    point: {},
    labelsContainer: {},
    label: {},
    emptyContainer: {},
    emptyText: {},
});

