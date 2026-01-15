import { View, Text, StyleSheet } from "react-native";

import { colors, fontFamily } from "@/theme";
import { useColors } from "@/hooks/useColors";

type BarData = {
    label: string;
    value: number;
};

type Props = {
    data: BarData[];
    maxValue?: number;
    showValues?: boolean;
    compact?: boolean;
};

export function HorizontalBarChart({ data, maxValue, showValues = true, compact = false }: Props) {
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

    return (
        <View style={{ marginTop: compact ? 12 : 16 }}>
            {data.map((item, index) => {

                const widthPercent = max > 0 ? (item.value / max) * 100 : 0;

                return (
                    <View key={index} style={{ marginBottom: compact ? 8 : 12 }}>
                        <View style={styles.barRow}>
                            <View style={{ width: compact ? 60 : 70, }}>
                                <Text style={styles.label} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </View>

                            <View style={[styles.barContainer, { height: compact ? 20 : 24 }]}>
                                <View
                                    style={[
                                        styles.bar,
                                        { width: `${widthPercent}%` }
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
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
    barContainer: {
        flex: 1,
        backgroundColor: colors.gray[100],
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: "#007FFA",
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 6,
    },
    value: {
        fontSize: 14,
        fontFamily: fontFamily.semibold,
        color: colors.white,
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