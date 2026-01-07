import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
    ChartLineUpIcon,
    ClockIcon,
    TrendUpIcon
} from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";

import { colors, fontFamily } from "@/theme";
import { useColors } from "@/hooks/useColors";
import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { analyzeJourney, JourneyAnalysis } from "@/utils/analyzeJourney";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function JourneyAnalysisScreen() {

    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const habitId = Number(id);
    const database = useSQLiteContext();
    const colorsTheme = useColors();

    const [records, setRecords] = useState<HabitRecordResponse[]>([]);
    const [analysis, setAnalysis] = useState<JourneyAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, [habitId]);

    const fetchRecords = async () => {
        try {
            const data = await database.getAllAsync<HabitRecordResponse>(`
                SELECT *
                FROM habit_records
                WHERE habit_id = ${habitId}
                ORDER BY date_time DESC
            `);

            setRecords(data);
            setAnalysis(analyzeJourney(data));
        } catch (error) {
            console.error("Erro ao buscar registros:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 56,
            backgroundColor: colorsTheme.background.primary,
        },
        wrapper: {
            paddingHorizontal: 16,
            paddingVertical: 24,
            gap: 24,
        },
        card: {
            backgroundColor: colorsTheme.background.secondary,
            borderRadius: 20,
            padding: 20,
            gap: 16,
        },
        riskCard: {
            backgroundColor: colorsTheme.background.secondary,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            gap: 12,
        },
        riskScore: {
            fontSize: 48,
            fontFamily: fontFamily.bold,
            color: colorsTheme.text.primary,
        },
        riskLabel: {
            fontSize: 18,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.secondary,
        },
        riskDescription: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            textAlign: 'center',
            marginTop: 8,
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            marginBottom: 4,
        },
        sectionDescription: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            lineHeight: 20,
        },
        patternItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 12,
        },
        patternIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colorsTheme.gray[100],
            justifyContent: 'center',
            alignItems: 'center',
        },
        patternText: {
            flex: 1,
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.primary,
        },
        triggerTag: {
            backgroundColor: colorsTheme.gray[100],
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginRight: 8,
            marginTop: 8,
        },
        triggerText: {
            fontSize: 13,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.primary,
        },
        emptyState: {
            padding: 24,
            alignItems: 'center',
            gap: 8,
        },
        emptyText: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            textAlign: 'center',
        },
    });

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'Alto':
                return '#FF453A';
            case 'Médio':
                return '#FF9500';
            case 'Baixo':
                return '#34C759';
            default:
                return colorsTheme.text.secondary;
        }
    };

    const getDayName = (day: string | null) => {
        if (!day) return null;
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    const getPeriodName = (period: string | null) => {
        if (!period) return null;
        return period.charAt(0).toUpperCase() + period.slice(1);
    };

    return (
        <View style={[{ flex: 1 }]}>
            <Header transparent />

            <ScrollView style={[styles.container, { paddingTop: insets.top + 56, }]}>
                <View style={styles.wrapper}>
                    {/* Card de Risco Hoje */}
                    {analysis && (
                        <View style={styles.riskCard}>
                            <Text style={[styles.riskScore, { color: getRiskColor(analysis.riskLevel) }]}>
                                {analysis.riskScore}
                            </Text>
                            <Text style={[styles.riskLabel, { color: getRiskColor(analysis.riskLevel) }]}>
                                Risco {analysis.riskLevel}
                            </Text>
                            <Text style={styles.riskDescription}>
                                Com base no seu histórico recente
                            </Text>
                        </View>
                    )}

                    {/* Card de Padrões Identificados */}
                    <View style={styles.card}>
                        <Title fontWeight="SEMIBOLD">
                            Padrões Identificados
                        </Title>
                        <Description>
                            Análise dos seus registros de recaídas
                        </Description>

                        {analysis && (
                            <View style={{ gap: 8 }}>
                                {analysis.mostRelapseDay && (
                                    <View style={styles.patternItem}>
                                        <View style={styles.patternIcon}>
                                            <ChartLineUpIcon
                                                size={20}
                                                color={colorsTheme.gray[700]}
                                                weight="fill"
                                            />
                                        </View>
                                        <Text style={styles.patternText}>
                                            Dia mais crítico: <Text style={{ fontFamily: fontFamily.semibold }}>{getDayName(analysis.mostRelapseDay)}</Text>
                                        </Text>
                                    </View>
                                )}

                                {analysis.mostCriticalPeriod && (
                                    <View style={styles.patternItem}>
                                        <View style={styles.patternIcon}>
                                            <ClockIcon
                                                size={20}
                                                color={colorsTheme.gray[700]}
                                                weight="fill"
                                            />
                                        </View>
                                        <Text style={styles.patternText}>
                                            Período mais crítico: <Text style={{ fontFamily: fontFamily.semibold }}>{getPeriodName(analysis.mostCriticalPeriod)}</Text>
                                        </Text>
                                    </View>
                                )}

                                {analysis.averageIntervalBetweenRelapses !== null && (
                                    <View style={styles.patternItem}>
                                        <View style={styles.patternIcon}>
                                            <TrendUpIcon
                                                size={20}
                                                color={colorsTheme.gray[700]}
                                                weight="fill"
                                            />
                                        </View>
                                        <Text style={styles.patternText}>
                                            Intervalo médio entre recaídas: <Text style={{ fontFamily: fontFamily.semibold }}>{analysis.averageIntervalBetweenRelapses} dias</Text>
                                        </Text>
                                    </View>
                                )}

                                {!analysis.mostRelapseDay && !analysis.mostCriticalPeriod && analysis.averageIntervalBetweenRelapses === null && (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>
                                            Não há dados suficientes para identificar padrões
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Card de Gatilhos Frequentes */}
                    {analysis && analysis.frequentTriggers.length > 0 && (
                        <View style={styles.card}>
                            <Title fontWeight="SEMIBOLD">
                                Gatilhos Frequentes
                            </Title>
                            <Description>
                                Termos mais mencionados nos seus registros
                            </Description>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                                {analysis.frequentTriggers.map((trigger, index) => (
                                    <View key={index} style={styles.triggerTag}>
                                        <Text style={styles.triggerText}>
                                            {trigger}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

