import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { useSQLiteContext } from "expo-sqlite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartLineUpIcon, ClockIcon, TrendUpIcon } from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Title } from "@/components/Text/Title";
import { EmptyState } from "@/components/EmptyState";
import { BookOpenTextIcon } from "phosphor-react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Description } from "@/components/Text/Description";

import { colors, fontFamily } from "@/theme";
import { useColors } from "@/hooks/useColors";
import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { analyzeJourney, JourneyAnalysis } from "@/utils/analyzeJourney";

export default function JourneyAnalysisScreen() {

    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const habitId = Number(id);
    const database = useSQLiteContext();
    const colorsTheme = useColors();

    const [records, setRecords] = useState<HabitRecordResponse[]>([]);
    const [analysis, setAnalysis] = useState<JourneyAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            setLoading(true);
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

    // Carregar dados quando o habitId mudar
    useEffect(() => {
        fetchRecords();
    }, [habitId]);

    // Recarregar dados sempre que a tela receber foco (volta de outras telas)
    useFocusEffect(
        useCallback(() => {
            fetchRecords();
        }, [habitId])
    );

    if (loading) {
        return <Loading />;
    }

    // Verificar se há registros suficientes para análise
    const hasRelapses = records.some(r => r.is_reset === 1);
    const hasNoData = records.length === 0 || !hasRelapses;


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

    const getTriggerTypeColor = (type: string) => {
        switch (type) {
            case 'temporal':
                return '#0A84FF';
            case 'emocional':
                return '#FF9500';
            case 'social':
                return '#AF52DE';
            case 'comportamental':
                return '#34C759';
            case 'contextual':
                return '#5856D6';
            default:
                return colorsTheme.gray[400];
        }
    };

    const getTriggerTypeLabel = (type: string) => {
        switch (type) {
            case 'temporal':
                return 'Temporal';
            case 'emocional':
                return 'Emocional';
            case 'social':
                return 'Social';
            case 'comportamental':
                return 'Comportamental';
            case 'contextual':
                return 'Contextual';
            default:
                return type;
        }
    };

    return (
        <View style={[{ flex: 1 }]}>
            <Header transparent />

            <ScrollView style={[styles.container, { paddingTop: insets.top + 56, }]}>
                <View style={styles.wrapper}>
                    {hasNoData ? (
                        <EmptyState
                            title="Ainda não existem registos suficientes para analisar a sua jornada."
                            message="Adicione registos diários para visualizar análises e padrões aqui."
                        />
                    ) : (
                        <>
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

                            {/* Card de Insights Combinados */}
                            {analysis && analysis.combinedInsights && analysis.combinedInsights.length > 0 && (
                                <View style={styles.card}>
                                    <Title fontWeight="SEMIBOLD">
                                        Padrões Identificados
                                    </Title>
                                    <Description>
                                        Combinações de gatilhos que aparecem juntos
                                    </Description>

                                    <View style={{ gap: 16, marginTop: 12 }}>
                                        {analysis.combinedInsights.map((insight, index) => (
                                            <View key={index} style={styles.insightItem}>
                                                <Text style={styles.insightText}>
                                                    {insight.text}
                                                </Text>
                                                <View style={styles.insightTriggers}>
                                                    {insight.triggers.map((trigger, tIndex) => (
                                                        <View
                                                            key={tIndex}
                                                            style={[
                                                                styles.insightTriggerTag,
                                                                { backgroundColor: getTriggerTypeColor(trigger.type) + '20' }
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.insightTriggerText,
                                                                { color: getTriggerTypeColor(trigger.type) }
                                                            ]}>
                                                                {trigger.label}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Card de Sugestão Contextual */}
                            {analysis && analysis.contextualSuggestion && (
                                <View style={styles.card}>
                                    <Title fontWeight="SEMIBOLD">
                                        Sugestão
                                    </Title>
                                    <Description style={{ marginTop: 8, lineHeight: 20, marginBottom: 16 }}>
                                        {analysis.contextualSuggestion.text}
                                    </Description>
                                    <PrimaryButton
                                        onPress={() => {
                                            // Navegar para o hub educacional, passando a categoria relacionada se houver
                                            const params = analysis.contextualSuggestion?.category
                                                ? { category: analysis.contextualSuggestion.category }
                                                : {};
                                            router.push({
                                                pathname: '/educational-hub',
                                                params
                                            });
                                        }}
                                        Icon={BookOpenTextIcon}
                                        label="Explorar conteúdos relacionados"
                                        backgroundColor={colorsTheme.background.primary}
                                    />
                                </View>
                            )}

                            {/* Card do Hub Educacional (sempre visível) */}
                            {/*
                            <View style={styles.card}>
                                <Title fontWeight="SEMIBOLD">
                                    Hub Educativo
                                </Title>
                                <Description style={{ marginTop: 8, lineHeight: 20, marginBottom: 16 }}>
                                    Conteúdos organizados por intenção para apoiar sua jornada de autoconsciência e mudança.
                                </Description>
                                <PrimaryButton
                                    onPress={() => router.push('/educational-hub')}
                                    Icon={BookOpenTextIcon}
                                    label="Explorar Hub Educativo"
                                    backgroundColor={colorsTheme.background.primary}
                                />
                            </View>
                            */}

                            {/* Card de Gatilhos Frequentes */}
                            {analysis && analysis.semanticTriggers && analysis.semanticTriggers.length > 0 && (
                                <View style={styles.card}>
                                    <Title fontWeight="SEMIBOLD">
                                        Gatilhos Frequentes
                                    </Title>
                                    <Description>
                                        Padrões identificados nos seus registros
                                    </Description>

                                    <View style={{ gap: 12, marginTop: 8 }}>
                                        {analysis.semanticTriggers.map((trigger, index) => (
                                            <View key={index} style={styles.triggerItem}>
                                                <View style={styles.triggerContent}>
                                                    <Text style={styles.triggerLabel}>
                                                        {trigger.label}
                                                    </Text>
                                                    <View style={[
                                                        styles.triggerTypeBadge,
                                                        { backgroundColor: getTriggerTypeColor(trigger.type) }
                                                    ]}>
                                                        <Text style={styles.triggerTypeText}>
                                                            {getTriggerTypeLabel(trigger.type)}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.confidenceBar}>
                                                    <View
                                                        style={[
                                                            styles.confidenceFill,
                                                            {
                                                                width: `${trigger.confidence * 100}%`,
                                                                backgroundColor: getTriggerTypeColor(trigger.type)
                                                            }
                                                        ]}
                                                    />
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 56,
        backgroundColor: colors.background.primary,
    },
    wrapper: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 24,
    },
    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    riskCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    riskScore: {
        fontSize: 48,
        fontFamily: fontFamily.bold,
        color: colors.text.primary,
    },
    riskLabel: {
        fontSize: 18,
        fontFamily: fontFamily.semibold,
        color: colors.text.secondary,
    },
    riskDescription: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: fontFamily.semibold,
        color: colors.text.primary,
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
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
        backgroundColor: colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    patternText: {
        flex: 1,
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
    triggerItem: {
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    triggerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    triggerLabel: {
        fontSize: 14,
        fontFamily: fontFamily.semibold,
        color: colors.text.primary,
        flex: 1,
    },
    triggerTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    triggerTypeText: {
        fontSize: 10,
        fontFamily: fontFamily.semibold,
        color: colors.white,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    confidenceBar: {
        height: 3,
        backgroundColor: colors.gray[100],
        borderRadius: 2,
        overflow: 'hidden',
    },
    confidenceFill: {
        height: '100%',
        borderRadius: 2,
    },
    insightItem: {
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    insightText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
        lineHeight: 20,
        marginBottom: 12,
    },
    insightTriggers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    insightTriggerTag: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    insightTriggerText: {
        fontSize: 12,
        fontFamily: fontFamily.semibold,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});