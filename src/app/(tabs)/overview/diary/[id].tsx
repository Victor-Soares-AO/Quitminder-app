import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Switch,
    TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Trash, PencilSimple, Check } from "phosphor-react-native";

import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { HabitInput } from "@/components/HabitInput";
import { HabitNumericInput } from "@/components/Inputs/HabitNumericInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CalendarDotsIcon, ClockIcon, CurrencyCircleDollarIcon } from "phosphor-react-native";

import { colors, fontFamily } from "@/theme";
import { formatDuration } from "@/utils/formatDuration";
import { useHabitRecordDatabase } from "@/database/useHabitRecordDatabase";
import { useHabit } from "@/contexts/useHabit";
import { useHabitDatabase } from "@/database/useHabitDatabase";

export default function EditRecord() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const recordId = Number(id);
    const { habit, setHabit } = useHabit();
    const { show, update, remove, getLastResetRecord, listByHabit } = useHabitRecordDatabase();
    const { update: updateHabit, show: showHabit } = useHabitDatabase();

    const [isEditing, setIsEditing] = useState(false);
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
    const [originalIsReset, setOriginalIsReset] = useState(false);

    useEffect(() => {
        loadRecord();
    }, [recordId]);

    const loadRecord = async () => {
        try {
            const record = await show(recordId);
            if (record) {
                setTitle(record.title || "");
                setNote(record.note || "");
                setIsReset(record.is_reset === 1);
                setOriginalIsReset(record.is_reset === 1);
                setDateTime(new Date(record.date_time));
                setTimeSpent(record.time_spent || 0);
                setMoneySpent(record.money_spent || 0);
                setMoneyDisplay(record.money_spent?.toFixed(2).replace(".", ",") || "");

                const formatted = new Intl.DateTimeFormat("pt-PT", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date(record.date_time));
                setFormattedDateTime(formatted);

                if (record.time_spent) {
                    setFormattedTime(formatDuration(record.time_spent));
                }
            }
        } catch (error) {
            console.error("Erro ao carregar registro:", error);
            Alert.alert("Erro", "Não foi possível carregar o registro.");
            router.back();
        }
    };

    const handleSave = async () => {
        try {
            if (!habit?.id) {
                Alert.alert("Erro", "Hábito não encontrado.");
                return;
            }

            const wasReset = originalIsReset;
            const willBeReset = isReset;

            await update(recordId, {
                title: title.trim() || null,
                note: note.trim() || null,
                date_time: dateTime.toISOString(),
                is_reset: isReset ? 1 : 0,
                time_spent: timeSpent || null,
                money_spent: moneySpent || null,
                currency: habit.default_currency || null,
            });

            // Recalcular last_relapse_date baseado em TODOS os registros
            // Isso garante que sempre use a recaída cronologicamente mais recente
            const allRecords = await listByHabit(habit.id);
            const { calculateLastRelapseDate } = await import("@/utils/calculateLastRelapse");
            const lastRelapseDate = calculateLastRelapseDate(allRecords);
            
            // Atualizar last_relapse_date do hábito com a recaída mais recente
            await updateHabit(habit.id, {
                last_relapse_date: lastRelapseDate ? new Date(lastRelapseDate) : null,
            });

            // Recarregar o hábito no contexto
            const updatedHabit = await showHabit(habit.id);
            if (updatedHabit) {
                setHabit(updatedHabit);
            }

            setIsEditing(false);
            Alert.alert("Sucesso", "Registro atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível atualizar o registro.");
        }
    };

    const handleDelete = async () => {
        if (!habit?.id) {
            Alert.alert("Erro", "Hábito não encontrado.");
            return;
        }

        const record = await show(recordId);
        const wasReset = record?.is_reset === 1;

        Alert.alert(
            "Apagar Registro",
            "Tem certeza que deseja apagar este registro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await remove(recordId);

                            // Recalcular last_relapse_date baseado em TODOS os registros
                            // Isso garante que sempre use a recaída cronologicamente mais recente
                            const allRecords = await listByHabit(habit.id);
                            const { calculateLastRelapseDate } = await import("@/utils/calculateLastRelapse");
                            const lastRelapseDate = calculateLastRelapseDate(allRecords);
                            
                            // Atualizar last_relapse_date do hábito com a recaída mais recente
                            await updateHabit(habit.id, {
                                last_relapse_date: lastRelapseDate ? new Date(lastRelapseDate) : null,
                            });

                            // Recarregar o hábito no contexto
                            const updatedHabit = await showHabit(habit.id);
                            if (updatedHabit) {
                                setHabit(updatedHabit);
                            }

                            router.back();
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Erro", "Não foi possível apagar o registro.");
                        }
                    },
                },
            ]
        );
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

    return (
        <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
            <Header transparent>
                {isEditing ? (
                    <View style={styles.headerActions}>
                        <IconButton
                            Icon={Check}
                            IconWeight="bold"
                            onPress={handleSave}
                        />
                        <IconButton
                            Icon={Trash}
                            IconWeight="bold"
                            onPress={handleDelete}
                        />
                    </View>
                ) : (
                    <View style={styles.headerActions}>
                        <IconButton
                            Icon={PencilSimple}
                            IconWeight="bold"
                            onPress={() => setIsEditing(true)}
                        />
                        <IconButton
                            Icon={Trash}
                            IconWeight="bold"
                            onPress={handleDelete}
                        />
                    </View>
                )}
            </Header>

            <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Title fontSize="LARGE">Detalhes do Registro</Title>
                </View>

                <View style={styles.group}>
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLabel}>
                            <Title>Praticou o hábito?</Title>
                            <Description fontSize="SMALL" style={{ marginTop: 4 }}>
                                {isReset 
                                    ? "Este registro reseta o tempo de abstinência" 
                                    : "Registro de atividade sem recaída"}
                            </Description>
                        </View>
                        {isEditing ? (
                            <Switch
                                value={isReset}
                                onValueChange={setIsReset}
                                trackColor={{ false: colors.gray[100], true: colors.text.primary }}
                                thumbColor={colors.white}
                            />
                        ) : (
                            <View style={styles.statusBadge}>
                                <Text style={[styles.statusText, isReset && styles.statusTextReset]}>
                                    {isReset ? "Recaída" : "Sem recaída"}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Data e Hora</Title>
                    {isEditing ? (
                        <HabitInput
                            Icon={CalendarDotsIcon}
                            iconWeight="regular"
                            title="Data e Hora"
                            rounded="full"
                            onPress={showDateTimePicker}
                            value={formattedDateTime || "Selecionar data e hora"}
                        />
                    ) : (
                        <View style={styles.readOnlyContainer}>
                            <CalendarDotsIcon size={20} color={colors.text.secondary} />
                            <Text style={styles.readOnlyText}>{formattedDateTime}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Título</Title>
                    {isEditing ? (
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ex: Manhã, Tarde, Noite..."
                                placeholderTextColor={colors.gray[400]}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                    ) : (
                        <View style={styles.readOnlyContainer}>
                            <Text style={styles.readOnlyText}>
                                {title || "Sem título"}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Nota</Title>
                    {isEditing ? (
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
                    ) : (
                        <View style={styles.readOnlyContainer}>
                            <Text style={styles.readOnlyText}>
                                {note || "Sem nota"}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Tempo Gasto</Title>
                    {isEditing ? (
                        <HabitInput
                            Icon={ClockIcon}
                            iconWeight="regular"
                            title="Tempo"
                            rounded="full"
                            onPress={showTimePicker}
                            value={formattedTime || "0 minutos"}
                        />
                    ) : (
                        <View style={styles.readOnlyContainer}>
                            <ClockIcon size={20} color={colors.text.secondary} />
                            <Text style={styles.readOnlyText}>
                                {formattedTime || "Não informado"}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.group}>
                    <Title color="SECONDARY">Dinheiro Gasto</Title>
                    {isEditing ? (
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
                    ) : (
                        <View style={styles.readOnlyContainer}>
                            <CurrencyCircleDollarIcon size={20} color={colors.text.secondary} />
                            <Text style={styles.readOnlyText}>
                                {moneySpent > 0 
                                    ? `${moneySpent.toFixed(2)} ${habit?.default_currency || "AOA"}` 
                                    : "Não informado"}
                            </Text>
                        </View>
                    )}
                </View>

                {isEditing && (
                    <View style={styles.buttonGroup}>
                        <PrimaryButton
                            label="Salvar Alterações"
                            onPress={handleSave}
                        />
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setIsEditing(false);
                                loadRecord();
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={handleDateTimePickerConfirm}
                    onCancel={() => setDateTimePickerVisibility(false)}
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
                    display="spinner"
                />

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimePickerConfirm}
                    onCancel={() => setTimePickerVisibility(false)}
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
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
    headerActions: {
        flexDirection: "row",
        gap: 8,
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
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: colors.gray[100],
    },
    statusText: {
        fontSize: 12,
        fontFamily: fontFamily.semibold,
        color: "#34C759",
    },
    statusTextReset: {
        color: "#FF453A",
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
    readOnlyContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.background.secondary,
        padding: 16,
        borderRadius: 12,
    },
    readOnlyText: {
        flex: 1,
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
    buttonGroup: {
        marginTop: 8,
    },
    cancelButton: {
        marginTop: 12,
        padding: 16,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
});

