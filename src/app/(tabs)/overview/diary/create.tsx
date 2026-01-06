import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Switch,
} from "react-native";
import { router } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Header } from "@/components/Header";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { HabitInput } from "@/components/HabitInput";
import { HabitNumericInput } from "@/components/Inputs/HabitNumericInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CalendarDotsIcon, ClockIcon, CurrencyCircleDollarIcon, NoteIcon } from "phosphor-react-native";

import { colors, fontFamily } from "@/theme";
import { formatDuration } from "@/utils/formatDuration";
import { useHabitRecordDatabase } from "@/database/useHabitRecordDatabase";
import { useHabit } from "@/contexts/useHabit";
import { useHabitDatabase } from "@/database/useHabitDatabase";

export default function CreateRecord() {
    const insets = useSafeAreaInsets();
    const { habit, setHabit } = useHabit();
    const { create } = useHabitRecordDatabase();
    const { update: updateHabit, show: showHabit } = useHabitDatabase();

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [isReset, setIsReset] = useState(false);
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const [formattedDateTime, setFormattedDateTime] = useState("");
    const [timeSpent, setTimeSpent] = useState(0);
    const [formattedTime, setFormattedTime] = useState("");
    const [moneySpent, setMoneySpent] = useState(0);
    const [moneyDisplay, setMoneyDisplay] = useState("");
    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const handleSave = async () => {
        if (!habit?.id) {
            Alert.alert("Erro", "Hábito não encontrado.");
            return;
        }

        try {
            // Criar o registro
            await create({
                habit_id: habit.id,
                title: title.trim() || null,
                note: note.trim() || null,
                date_time: dateTime.toISOString(),
                is_reset: isReset ? 1 : 0,
                time_spent: timeSpent || null,
                money_spent: moneySpent || null,
                currency: habit.default_currency || null,
            });

            // Se is_reset = 1, atualizar last_relapse_date do hábito
            if (isReset) {
                await updateHabit(habit.id, {
                    last_relapse_date: dateTime,
                });

                // Recarregar o hábito no contexto para atualizar a tela Overview
                const updatedHabit = await showHabit(habit.id);
                if (updatedHabit) {
                    setHabit(updatedHabit);
                }
            }

            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar o registro.");
        }
    };

    const showDateTimePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const handleDateTimePickerConfirm = (selectedDate: Date) => {
        setDateTime(selectedDate);
        const formatted = new Intl.DateTimeFormat("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(selectedDate);
        setFormattedDateTime(formatted);
        setDateTimePickerVisibility(false);
    };

    const handleTimePickerConfirm = (selectedTime: Date) => {
        const hours = selectedTime.getHours();
        const minutes = selectedTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        setTimeSpent(totalMinutes);
        setFormattedTime(formatDuration(totalMinutes));
        setTimePickerVisibility(false);
    };

    // Inicializar data formatada
    useEffect(() => {
        const formatted = new Intl.DateTimeFormat("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(dateTime);
        setFormattedDateTime(formatted);
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
            <Header transparent />

            <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Title fontSize="LARGE">
                        Novo Registro
                    </Title>

                    <Description style={{ marginTop: 8 }}>
                        Registre sua atividade diária e acompanhe seu progresso.
                    </Description>
                </View>

                <View style={styles.group}>
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLabel}>
                            <Title>Praticou o hábito?</Title>
                            <Description fontSize="SMALL" style={{ marginTop: 4 }}>
                                {isReset
                                    ? "Este registro irá resetar seu tempo de abstinência"
                                    : "Registro de atividade sem recaída"}
                            </Description>
                        </View>
                        <Switch
                            value={isReset}
                            onValueChange={setIsReset}
                            trackColor={{ false: colors.gray[100], true: colors.text.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">
                        Data e Hora
                    </Title>

                    <HabitInput
                        Icon={CalendarDotsIcon}
                        iconWeight="regular"
                        title="Data e Hora"
                        rounded="full"
                        onPress={showDateTimePicker}
                        value={formattedDateTime || "Selecionar data e hora"}
                    />
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Título (opcional)</Title>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ex: Manhã, Tarde, Noite..."
                            placeholderTextColor={colors.gray[400]}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Nota (opcional)</Title>
                    <View style={[styles.textInputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Adicione uma nota sobre este registro..."
                            placeholderTextColor={colors.gray[400]}
                            value={note}
                            onChangeText={setNote}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Tempo Gasto (opcional)</Title>
                    <HabitInput
                        Icon={ClockIcon}
                        iconWeight="regular"
                        title="Tempo"
                        rounded="full"
                        onPress={showTimePicker}
                        value={formattedTime || "0 minutos"}
                    />
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Dinheiro Gasto (opcional)</Title>
                    <HabitNumericInput
                        Icon={CurrencyCircleDollarIcon}
                        iconWeight="regular"
                        title="Quantidade"
                        value={moneyDisplay}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9,]/g, "");
                            setMoneyDisplay(cleaned);
                            const dbValue = parseFloat(cleaned.replace(",", ".")) || 0;
                            setMoneySpent(dbValue);
                        }}
                        rounded="full"
                    />
                </View>

                <PrimaryButton
                    label="Salvar Registro"
                    onPress={handleSave}
                />

                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={handleDateTimePickerConfirm}
                    onCancel={() => setDateTimePickerVisibility(false)}
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
                    maximumDate={new Date()}
                    display="spinner"
                />

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimePickerConfirm}
                    onCancel={() => setTimePickerVisibility(false)}
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
                    minimumDate={new Date(2024, 0, 1, 0, 0, 0, 0)}
                    maximumDate={new Date(2024, 0, 1, 23, 59, 0, 0)}
                    display="spinner"
                />
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    group: {
        marginBottom: 24,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background.secondary,
        padding: 16,
        borderRadius: 12,
    },
    switchLabel: {
        flex: 1,
        marginRight: 16,
    },
    textInputContainer: {
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    textAreaContainer: {
        minHeight: 100,
    },
    textInput: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
    textArea: {
        minHeight: 80,
    },
});

