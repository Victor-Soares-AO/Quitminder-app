import { useState, useEffect, useCallback } from "react";
import { ProgressCard } from "@/components/Card/ProgressCard";
import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { IconButton } from "@/components/IconButton";
import { Description } from "@/components/Text/Description";
import { Title } from "@/components/Text/Title";
import { useHabit } from "@/contexts/useHabit";
import { colors } from "@/theme";
import { formatDateToDayMonth } from "@/utils/formatDate";
import { calculateStatistics } from "@/utils/calculateStatistics";
import { useHabitRecordDatabase } from "@/database/useHabitRecordDatabase";
import { ArrowLeftIcon, ClockIcon, CreditCardIcon, HourglassHighIcon, HourglassLowIcon, HourglassMediumIcon, InfinityIconIcon, StarIcon } from "phosphor-react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";

export default function Statistic() {
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

    const loadStatistics = async () => {
        if (!habit?.id) return;

        try {
            const records = await listByHabit(habit.id);
            const stats = calculateStatistics(
                records,
                habit.created_at,
                habit.last_relapse_date
            );
            setStatistics(stats);
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, [habit]);

    useFocusEffect(
        useCallback(() => {
            loadStatistics();
        }, [habit])
    );

    const startDate = formatDateToDayMonth(habit?.created_at);
    const lastRelapse = formatDateToDayMonth(habit?.last_relapse_date);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <Header />
            <ScrollView style={[styles.container]}>
                <Heading fontSize="LARGE">
                    {t("statistics.title")}
                </Heading>

                <View style={styles.summaryCardWrapper}>
                    <View style={styles.summaryCard}>
                        <StarIcon
                            size={24}
                            color={colors.gray[700]}
                            weight="bold"
                        />

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
                        <InfinityIconIcon
                            size={24}
                            color={colors.gray[700]}
                            weight="bold"
                        />

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
                        Icon={InfinityIconIcon}
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
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 80,
        backgroundColor: colors.background.primary,
        paddingBottom: 0,
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