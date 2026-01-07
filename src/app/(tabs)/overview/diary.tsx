import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SectionList,
} from "react-native";

import { PlusIcon } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    ClockIcon,
    CurrencyDollarIcon,
    NoteIcon,
    XCircleIcon,
    CheckCircleIcon
} from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";
import { Description } from "@/components/Text/Description";

import { colors, fontFamily } from "@/theme";
import { useHabit } from "@/contexts/useHabit";
import { formatDuration } from "@/utils/formatDuration";
import { formatDateToDayMonth } from "@/utils/formatDate";
import { useHabitRecordDatabase, HabitRecordResponse } from "@/database/useHabitRecordDatabase";

type GroupedRecords = {
    date: string;
    formattedDate: string;
    data: HabitRecordResponse[];
};

export default function Diary() {
    const insets = useSafeAreaInsets();
    const { habit } = useHabit();
    const { listByHabit } = useHabitRecordDatabase();

    const [records, setRecords] = useState<HabitRecordResponse[]>([]);
    const [groupedRecords, setGroupedRecords] = useState<GroupedRecords[]>([]);

    const fetchRecords = async () => {
        if (!habit?.id) return;
        try {
            const data = await listByHabit(habit.id);
            setRecords(data);
            groupRecordsByDate(data);
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        }
    };

    const groupRecordsByDate = (records: HabitRecordResponse[]) => {
        const grouped: { [key: string]: HabitRecordResponse[] } = {};

        records.forEach((record) => {
            const date = new Date(record.date_time);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(record);
        });

        const sections: GroupedRecords[] = Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a)) // Mais recente primeiro
            .map((dateKey) => {
                const date = new Date(dateKey);
                return {
                    date: dateKey,
                    formattedDate: formatDateToDayMonth(dateKey),
                    data: grouped[dateKey],
                };
            });

        setGroupedRecords(sections);
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecords();
        }, [habit])
    );

    const handleAddRecord = () => {
        router.push("/(tabs)/overview/diary/create");
    };

    const handleRecordPress = (record: HabitRecordResponse) => {
        router.push({
            pathname: "/(tabs)/overview/diary/[id]",
            params: { id: record.id.toString() },
        });
    };

    const renderRecord = ({ item }: { item: HabitRecordResponse }) => {
        const date = new Date(item.date_time);
        const time = date.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleRecordPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                        {item.is_reset ? (
                            <XCircleIcon
                                size={20}
                                color="#FF453A"
                                weight="fill"
                            />
                        ) : (
                            <CheckCircleIcon
                                size={20}
                                color="#34C759"
                                weight="fill"
                            />
                        )}
                        <Text style={styles.timeText}>{time}</Text>
                    </View>
                    <Text style={styles.statusText}>
                        {item.is_reset ? "Recaída" : "Sem recaída"}
                    </Text>
                </View>

                {item.title && (
                    <Title fontSize="LARGE" style={{ marginTop: 8 }}>
                        {item.title}
                    </Title>
                )}

                {item.note && (
                    <Description style={{ marginTop: 4 }}>
                        {item.note}
                    </Description>
                )}

                <View style={styles.cardFooter}>
                    {item.time_spent !== null && item.time_spent !== undefined && (
                        <View style={styles.infoItem}>
                            <ClockIcon size={16} color={colors.text.secondary} />
                            <Description fontSize="SMALL">
                                {formatDuration(item.time_spent)}
                            </Description>
                        </View>
                    )}
                    {item.money_spent !== null && item.money_spent !== undefined && (
                        <View style={styles.infoItem}>
                            <CurrencyDollarIcon size={16} color={colors.text.secondary} />
                            <Description fontSize="SMALL">
                                {item.money_spent.toFixed(2)} {item.currency || "AOA"}
                            </Description>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = ({ section }: { section: GroupedRecords }) => (
        <View style={styles.sectionHeader}>
            <Heading fontSize="NORMAL">
                {section.formattedDate}
            </Heading>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background.primary,
        },
        sectionHeader: {
            marginTop: 24,
            marginBottom: 12,
        },
        card: {
            backgroundColor: colors.background.secondary,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
        },
        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        cardHeaderLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        timeText: {
            fontSize: 14,
            fontFamily: "Inter-Medium",
            color: colors.text.secondary,
        },
        statusText: {
            fontSize: 12,
            fontFamily: "Inter-Medium",
            color: colors.text.secondary,
        },
        cardFooter: {
            flexDirection: "row",
            gap: 16,
            marginTop: 12,
        },
        infoItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        emptyContainer: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 80,
        },
        emptyText: {
            fontSize: 20,
            fontFamily: fontFamily.semibold,
            color: colors.text.primary,
            marginTop: 16,
        },
        button: {
            position: "absolute",
            bottom: 32,
            right: 24,
            backgroundColor: colors.text.primary,
            borderRadius: 999,
            padding: 16,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 80, }]}>
            <Header transparent />

            <SectionList
                sections={groupedRecords}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecord}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={{
                    padding: 16,
                    paddingTop: 0,
                    paddingBottom: 100,
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <NoteIcon size={80} color={colors.text.secondary} />

                        <Text style={styles.emptyText}>
                            Nenhum registro ainda.
                        </Text>

                        <Text
                            style={{
                                marginTop: 8,
                                textAlign: 'center',
                                fontSize: 16,
                                lineHeight: 24,
                                fontFamily: fontFamily.medium,
                                color: colors.text.secondary
                            }}
                        >
                            Adicione seu primeiro registro para{'\n'} começar a acompanhar sua jornada.
                        </Text>
                    </View>
                }
                ListHeaderComponent={
                    <View>
                        <Heading fontSize="LARGE">
                            Diário de Atividades
                        </Heading>

                        <Title color="SECONDARY" style={{ marginTop: 8 }}>
                            Registre suas atividades diárias e acompanhe seu progresso.
                        </Title>
                    </View>
                }
            />

            {/* Botão flutuante */}
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleAddRecord}
            >
                <PlusIcon
                    size={28}
                    color="#fff"
                    weight="bold"
                />
            </TouchableOpacity>
        </View>
    );
}