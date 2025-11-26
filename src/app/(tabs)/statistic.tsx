import { ProgressCard } from "@/components/Card/ProgressCard";
import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { IconButton } from "@/components/IconButton";
import { Description } from "@/components/Text/Description";
import { Title } from "@/components/Text/Title";
import { useHabit } from "@/contexts/useHabit";
import { colors } from "@/theme";
import { formatDateToDayMonth } from "@/utils/formatDate";
import { ArrowLeftIcon, ClockIcon, CreditCardIcon, HourglassHighIcon, HourglassLowIcon, HourglassMediumIcon, InfinityIconIcon, StarIcon } from "phosphor-react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Statistic() {

    const { habit } = useHabit();

    const startDate = formatDateToDayMonth(habit?.created_at);
    const lastRelapse = formatDateToDayMonth(habit?.last_relapse_date);

    // console.log();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <ScrollView style={[styles.container]}>
                <Heading fontSize="LARGE">
                    Estatística
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
                                Data de Início
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
                                Última Recaída
                            </Description>

                            <Title fontWeight="SEMIBOLD">
                                {lastRelapse}
                            </Title>
                        </View>
                    </View>
                </View>

                <Title>
                    Progresso
                </Title>

                <View style={styles.progressCardsWrapper}>
                    <ProgressCard
                        Icon={InfinityIconIcon}
                        title="Total de recaídas"
                        value="2 recaídas"
                    />

                    <ProgressCard
                        Icon={HourglassHighIcon}
                        iconWeight="fill"
                        title="Tempo mínimo de abstinência"
                        value="3 dias, 17 horas, 54 minutos"
                    />

                    <ProgressCard
                        Icon={HourglassMediumIcon}
                        iconWeight="fill"
                        title="Tempo médio de abstinência"
                        value="3 dias, 17 horas, 54 minutos"
                    />

                    <ProgressCard
                        Icon={HourglassLowIcon}
                        iconWeight="fill"
                        title="Tempo máximo de abstinência"
                        value="3 dias, 17 horas, 54 minutos"
                    />
                </View>

                <Title>
                    Tempo e Dinheiro
                </Title>

                <View style={styles.progressCardsWrapper}>
                    <ProgressCard
                        Icon={ClockIcon}
                        title="Tempo gasto no hábito"
                        value="2 horas, 30 minutos"
                    />

                    <ProgressCard
                        Icon={CreditCardIcon}
                        title="Dinheiro gasto no hábito"
                        value="189 000 Kz"
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
        backgroundColor: colors.background.primary
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