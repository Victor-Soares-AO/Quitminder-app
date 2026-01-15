import { useFocusEffect } from "expo-router";

import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
    ClockIcon, 
    CreditCardIcon, 
    HourglassHighIcon, 
    HourglassLowIcon, 
    HourglassMediumIcon 
} from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";
import { EmptyState } from "@/components/EmptyState";
import { ChartCard } from "@/components/Chart/ChartCard";
import { Description } from "@/components/Text/Description";
import { ProgressCard } from "@/components/Card/ProgressCard";
import { HorizontalBarChart } from "@/components/Chart/HorizontalBarChart";

import { colors } from "@/theme";
import { useHabit } from "@/contexts/useHabit";

import { useHabitRecordDatabase } from "@/database/useHabitRecordDatabase";
import { useTranslation } from "@/hooks/useTranslation";
import { 
    getRelapsesByDayOfWeek, 
    getRelapsesByPeriodOfDay, 
    getIntervalsBetweenRelapses 
} from "@/utils/chartData";

import { formatDateToDayMonth } from "@/utils/formatDate";
import { calculateStatistics } from "@/utils/calculateStatistics";
import { calculateLastRelapseDate } from "@/utils/calculateLastRelapse";
import { generateDayOfWeekInsight, generatePeriodOfDayInsight } from "@/utils/chartInsights";
import { simplifyIntervalEvolution, generateSimpleEvolutionInsight } from "@/utils/simplifyIntervalEvolution";

import { Repeat2, Star } from "lucide-react-native";

export default function Statistic() {
    const insets = useSafeAreaInsets();
    const { habit } = useHabit();
    const { listByHabit } = useHabitRecordDatabase();
    const { t } = useTranslation();
    const [statistics, setStatistics] = useState({
        totalRelapses: 0,
        minAbstinencePeriod: "—",
        avgAbstinencePeriod: "—",
        maxAbstinencePeriod: "—",
        totalTimeSpent: "0 minutos",
        totalMoneySpent: "0.00",
        currency: "KZ",
    });
    const [records, setRecords] = useState<any[]>([]);

    const loadStatistics = async () => {
        if (!habit?.id) return;

        try {
            const recordsData = await listByHabit(habit.id);
            setRecords(recordsData);
            const stats = calculateStatistics(
                recordsData,
                habit.created_at,
                habit.last_relapse_date
            );
            setStatistics(stats);
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    };

    // Calcular última recaída a partir dos registros reais (sempre usa a mais recente)
    const lastRelapseDate = records.length > 0
        ? calculateLastRelapseDate(records)
        : habit?.last_relapse_date;
    const lastRelapse = lastRelapseDate
        ? formatDateToDayMonth(lastRelapseDate)
        : "—";

    useEffect(() => {
        loadStatistics();
    }, [habit]);

    useFocusEffect(
        useCallback(() => {
            loadStatistics();
        }, [habit])
    );

    const startDate = formatDateToDayMonth(habit?.created_at);

    return (
        <>
            <Header transparent />

            <ScrollView
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background.primary,
                        paddingTop: insets.top + 56
                    }
                ]}
            >
                <Heading fontSize="LARGE">
                    {t("statistics.title")}
                </Heading>

                <View style={styles.summaryCardWrapper}>
                    <View style={styles.summaryCard}>
                        <Star size={24} color={colors.gray[700]} />

                        <View style={styles.summaryCardTextWrapper}>
                            <Description>
                                {t("statistics.startDate")}
                            </Description>

                            <Title fontWeight="SEMIBOLD">
                                {startDate}
                            </Title>
                        </View>
                    </View>

                    <View style={styles.summaryCard}>
                        <Repeat2 size={24} color={colors.gray[700]} />

                        <View style={styles.summaryCardTextWrapper}>
                            <Description>
                                {t("statistics.lastRelapse")}
                            </Description>

                            <Title fontWeight="SEMIBOLD">
                                {lastRelapse}
                            </Title>
                        </View>
                    </View>
                </View>

                <Title>
                    {t("statistics.progress")}
                </Title>

                <View style={styles.progressCardsWrapper}>
                    <ProgressCard
                        Icon={Repeat2}
                        title={t("statistics.totalRelapses")}
                        value={`${statistics.totalRelapses} ${statistics.totalRelapses !== 1 ? t("statistics.relapses") : t("statistics.relapse")}`}
                    />

                    <ProgressCard
                        Icon={HourglassHighIcon}
                        iconWeight="fill"
                        title={t("statistics.minAbstinence")}
                        value={statistics.minAbstinencePeriod}
                    />

                    <ProgressCard
                        Icon={HourglassMediumIcon}
                        iconWeight="fill"
                        title={t("statistics.avgAbstinence")}
                        value={statistics.avgAbstinencePeriod}
                    />

                    <ProgressCard
                        Icon={HourglassLowIcon}
                        iconWeight="fill"
                        title={t("statistics.maxAbstinence")}
                        value={statistics.maxAbstinencePeriod}
                    />
                </View>

                <Title>
                    {t("statistics.timeAndMoney")}
                </Title>

                <View style={styles.progressCardsWrapper}>
                    <ProgressCard
                        Icon={ClockIcon}
                        title={t("statistics.timeSpent")}
                        value={statistics.totalTimeSpent}
                    />

                    <ProgressCard
                        Icon={CreditCardIcon}
                        title={t("statistics.moneySpent")}
                        value={`${parseFloat(statistics.totalMoneySpent).toLocaleString("pt-PT")} ${statistics.currency}`}
                    />
                </View>

                <Title>
                    Análise Interpretativa
                </Title>

                <View style={styles.progressCardsWrapper}>
                    {/* Verificar se há registros com recaídas */}
                    {(() => {
                        const hasRelapses = records.some(r => r.is_reset === 1);

                        if (records.length === 0 || !hasRelapses) {
                            return (
                                <EmptyState
                                    title="Ainda não existem registos suficientes para análise."
                                    message="Adicione registos diários para visualizar estatísticas e gráficos aqui."
                                    compact
                                />
                            );
                        }

                        return (
                            <>
                                {/* Gráfico: Recaídas por Dia da Semana */}
                                {(() => {
                                    const dayData = getRelapsesByDayOfWeek(records);
                                    const dayBarData = dayData.map(d => ({ label: d.day, value: d.count }));
                                    const insight = generateDayOfWeekInsight(dayData);

                                    if (!insight) return null;

                                    return (
                                        <ChartCard
                                            title="Recaídas por Dia da Semana"
                                            headline={insight.headline}
                                            subtext={insight.subtext}
                                        >
                                            <HorizontalBarChart data={dayBarData} compact />
                                        </ChartCard>
                                    );
                                })()}

                                {/* Gráfico: Recaídas por Período do Dia */}
                                {(() => {
                                    const periodData = getRelapsesByPeriodOfDay(records);
                                    const periodBarData = periodData.map(d => ({ label: d.period, value: d.count }));
                                    const insight = generatePeriodOfDayInsight(periodData);

                                    if (!insight) return null;

                                    return (
                                        <ChartCard
                                            title="Recaídas por Período do Dia"
                                            headline={insight.headline}
                                            subtext={insight.subtext}
                                        >
                                            <HorizontalBarChart data={periodBarData} compact />
                                        </ChartCard>
                                    );
                                })()}

                                {/* Gráfico: Evolução do Intervalo Entre Recaídas (Simplificado) */}
                                {(() => {
                                    const intervalData = getIntervalsBetweenRelapses(records);

                                    if (intervalData.length >= 3) {
                                        // Simplificar para 2-3 pontos representativos
                                        const simplified = simplifyIntervalEvolution(intervalData);
                                        const insight = generateSimpleEvolutionInsight(intervalData);

                                        if (!insight || simplified.length === 0) return null;

                                        // Converter para formato de barras horizontais
                                        const barData = simplified.map(item => ({
                                            label: item.label,
                                            value: item.value
                                        }));

                                        return (
                                            <ChartCard
                                                title="Evolução do Intervalo Entre Recaídas"
                                                headline={insight.headline}
                                                subtext={insight.subtext}
                                            >
                                                <HorizontalBarChart data={barData} compact />
                                            </ChartCard>
                                        );
                                    }
                                    return null;
                                })()}
                            </>
                        );
                    })()}
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 80,
        backgroundColor: colors.background.primary,
        paddingBottom: 32,
    },
    title: {
        color: colors.white,
        fontSize: 18
    },
    summaryCardWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 24
    },
    summaryCard: {
        width: '48%',
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 24,
        borderRadius: 16,
        backgroundColor: colors.background.secondary
    },
    summaryCardTextWrapper: {
    },
    progressCardsWrapper: {
        marginTop: 12,
        marginBottom: 24,
        gap: 16
    }
})