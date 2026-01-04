import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    FlatList,
} from "react-native";
import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import { useHabit } from "@/contexts/useHabit";
import { useHabitRecordDatabase, HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { colors, fontFamily } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { useFocusEffect } from "expo-router";
import { CaretLeft, CaretRight, X, CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon } from "phosphor-react-native";
import { formatDuration } from "@/utils/formatDuration";
import { router } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";

type DayStatus = "empty" | "abstinence" | "relapse";

type DayData = {
    date: Date;
    day: number;
    status: DayStatus;
    records: HabitRecordResponse[];
    isCurrentMonth: boolean;
};

export default function Calendar() {
    const insets = useSafeAreaInsets();
    const { habit } = useHabit();
    const { listByHabit } = useHabitRecordDatabase();
    const { t, language } = useTranslation();
    
    const DAYS_OF_WEEK = [
        t("calendar.sunday"),
        t("calendar.monday"),
        t("calendar.tuesday"),
        t("calendar.wednesday"),
        t("calendar.thursday"),
        t("calendar.friday"),
        t("calendar.saturday"),
    ];
    
    const MONTHS = language === "en" ? [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ] : [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [records, setRecords] = useState<HabitRecordResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDayRecords, setSelectedDayRecords] = useState<HabitRecordResponse[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [calendarDays, setCalendarDays] = useState<DayData[]>([]);

    const loadRecords = async () => {
        if (!habit?.id) return;

        try {
            const data = await listByHabit(habit.id);
            setRecords(data);
            buildCalendar(data);
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadRecords();
        }, [habit])
    );

    useEffect(() => {
        buildCalendar(records);
    }, [currentDate, records]);

    const buildCalendar = (recordsData: HabitRecordResponse[]) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Dia da semana do primeiro dia (0 = Domingo, 6 = Sábado)
        const startDayOfWeek = firstDay.getDay();

        // Último dia do mês
        const daysInMonth = lastDay.getDate();

        const days: DayData[] = [];

        // Adicionar dias do mês anterior para preencher a primeira semana
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({
                date,
                day: prevMonthLastDay - i,
                status: "empty",
                records: [],
                isCurrentMonth: false,
            });
        }

        // Adicionar dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toISOString().split('T')[0];

            // Buscar registros deste dia
            const dayRecords = recordsData.filter((record) => {
                const recordDate = new Date(record.date_time);
                const recordDateKey = recordDate.toISOString().split('T')[0];
                return recordDateKey === dateKey;
            });

            let status: DayStatus = "empty";
            if (dayRecords.length > 0) {
                // Se tem algum registro com is_reset = 1, é recaída
                const hasRelapse = dayRecords.some((r) => r.is_reset === 1);
                status = hasRelapse ? "relapse" : "abstinence";
            }

            days.push({
                date,
                day,
                status,
                records: dayRecords,
                isCurrentMonth: true,
            });
        }

        // Adicionar dias do próximo mês para completar a última semana
        const totalDays = days.length;
        const remainingDays = 42 - totalDays; // 6 semanas * 7 dias
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                day,
                status: "empty",
                records: [],
                isCurrentMonth: false,
            });
        }

        setCalendarDays(days);
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayPress = (dayData: DayData) => {
        if (!dayData.isCurrentMonth || dayData.records.length === 0) return;

        setSelectedDate(dayData.date);
        setSelectedDayRecords(dayData.records);
        setModalVisible(true);
    };

    const handleRecordPress = (record: HabitRecordResponse) => {
        setModalVisible(false);
        router.push({
            pathname: "/(tabs)/overview/diary/[id]",
            params: { id: record.id.toString() },
        });
    };

    const renderDay = (dayData: DayData, index: number) => {
        const isToday =
            dayData.isCurrentMonth &&
            dayData.date.toDateString() === new Date().toDateString();

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.day,
                    !dayData.isCurrentMonth && styles.dayOtherMonth,
                    isToday && styles.dayToday,
                ]}
                onPress={() => handleDayPress(dayData)}
                disabled={!dayData.isCurrentMonth || dayData.records.length === 0}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.dayText,
                        !dayData.isCurrentMonth && styles.dayTextOtherMonth,
                        isToday && styles.dayTextToday,
                    ]}
                >
                    {dayData.day}
                </Text>
                {dayData.isCurrentMonth && dayData.status !== "empty" && (
                    <View
                        style={[
                            styles.statusIndicator,
                            dayData.status === "relapse"
                                ? styles.statusIndicatorRelapse
                                : styles.statusIndicatorAbstinence,
                        ]}
                    />
                )}
            </TouchableOpacity>
        );
    };

    const renderRecord = ({ item }: { item: HabitRecordResponse }) => {
        const date = new Date(item.date_time);
        const time = date.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <TouchableOpacity
                style={styles.recordCard}
                onPress={() => handleRecordPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.recordHeader}>
                    <View style={styles.recordHeaderLeft}>
                        {item.is_reset ? (
                            <XCircleIcon size={20} color="#FF453A" weight="fill" />
                        ) : (
                            <CheckCircleIcon size={20} color="#34C759" weight="fill" />
                        )}
                        <Text style={styles.timeText}>{time}</Text>
                    </View>
                    <Text style={styles.statusText}>
                        {item.is_reset ? t("diary.relapse") : t("diary.noRelapse")}
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

                <View style={styles.recordFooter}>
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

    const selectedDateFormatted = selectedDate
        ? selectedDate.toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "";

    return (
        <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
            <Header transparent />

            <View style={styles.content}>
                <Heading fontSize="LARGE">{t("calendar.title")}</Heading>

                {/* Navegação do mês */}
                <View style={styles.monthNavigation}>
                    <TouchableOpacity
                        onPress={goToPreviousMonth}
                        style={styles.monthNavButton}
                    >
                        <CaretLeft size={24} color={colors.text.primary} weight="bold" />
                    </TouchableOpacity>

                    <Text style={styles.monthText}>
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>

                    <TouchableOpacity
                        onPress={goToNextMonth}
                        style={styles.monthNavButton}
                    >
                        <CaretRight size={24} color={colors.text.primary} weight="bold" />
                    </TouchableOpacity>
                </View>

                {/* Cabeçalho dos dias da semana */}
                <View style={styles.weekHeader}>
                    {DAYS_OF_WEEK.map((day, index) => (
                        <View key={index} style={styles.weekDay}>
                            <Text style={styles.weekDayText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Grid do calendário */}
                <View style={styles.calendarGrid}>
                    {calendarDays.map((dayData, index) => renderDay(dayData, index))}
                </View>

                {/* Legenda */}
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendIndicator, styles.statusIndicatorAbstinence]} />
                        <Description fontSize="SMALL">{t("diary.noRelapse")}</Description>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendIndicator, styles.statusIndicatorRelapse]} />
                        <Description fontSize="SMALL">{t("diary.relapse")}</Description>
                    </View>
                </View>
            </View>

            {/* Modal com registros do dia */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Heading fontSize="LARGE">
                                {selectedDateFormatted}
                            </Heading>
                            <IconButton
                                Icon={X}
                                IconWeight="bold"
                                onPress={() => setModalVisible(false)}
                            />
                        </View>

                        {selectedDayRecords.length > 0 ? (
                            <FlatList
                                data={selectedDayRecords}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderRecord}
                                contentContainerStyle={styles.modalList}
                            />
                        ) : (
                            <View style={styles.emptyModal}>
                                <Text style={styles.emptyModalText}>
                                    {t("calendar.emptyDay")}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    monthNavigation: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 24,
    },
    monthNavButton: {
        padding: 8,
    },
    monthText: {
        fontSize: 18,
        fontFamily: fontFamily.semibold,
        color: colors.text.primary,
    },
    weekHeader: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDay: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    weekDayText: {
        fontSize: 12,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    day: {
        width: "14.28%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    dayOtherMonth: {
        opacity: 0.3,
    },
    dayToday: {
        backgroundColor: colors.gray[100],
        borderRadius: 8,
    },
    dayText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
    dayTextOtherMonth: {
        color: colors.text.tertiary,
    },
    dayTextToday: {
        fontFamily: fontFamily.semibold,
    },
    statusIndicator: {
        position: "absolute",
        bottom: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusIndicatorAbstinence: {
        backgroundColor: "#34C759",
    },
    statusIndicatorRelapse: {
        backgroundColor: "#FF453A",
    },
    legend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
        marginTop: 24,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
        padding: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalList: {
        paddingBottom: 16,
    },
    recordCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    recordHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    recordHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    timeText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
    statusText: {
        fontSize: 12,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
    recordFooter: {
        flexDirection: "row",
        gap: 16,
        marginTop: 12,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    emptyModal: {
        padding: 40,
        alignItems: "center",
    },
    emptyModalText: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
});
