import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";

import * as PhosphorIcons from "phosphor-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Title } from "@/components/Text/Title";
import { HabitInput } from "@/components/HabitInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HabitNumericInput } from "@/components/Inputs/HabitNumericInput";
import { Loading } from "@/components/Loading";

import { colors, fontFamily } from "@/theme";
import { habitColors } from "@/utils/habitColors";
import { formatDuration } from "@/utils/formatDuration";
import { useHabitDatabase } from "@/database/useHabitDatabase";
import { useAffirmationDatabase } from "@/database/useAffirmationDatabase";
import { getIconCategories } from "@/constants/icons/getIconCategories";
import { currencies } from "@/constants/currencies";
import { useLanguage } from "@/contexts/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";

export default function EditHabit() {

    const params = useLocalSearchParams();
    const { language } = useLanguage();
    const { t } = useTranslation();

    const iconCategories = getIconCategories(language);

    // Detectar se está editando ou criando
    const habitIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const isEditing = habitIdParam && !isNaN(Number(habitIdParam));
    const habitId = isEditing ? Number(habitIdParam) : null;

    // Usar useEffect para garantir que os parâmetros sejam lidos corretamente
    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("Star");

    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [date, setDate] = useState<Date>(null);
    const [time, setTime] = useState(0);
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedTime, setFormattedTime] = useState("");
    // Inicializar com uma data fixa e independente para o seletor de tempo
    const [timePickerDate, setTimePickerDate] = useState<Date>(() => {
        const fixedDate = new Date(2024, 0, 1, 0, 0, 0, 0);
        return fixedDate;
    });
    const [amount, setAmount] = useState(0);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [defaultCurrency, setDefaultCurrency] = useState("AOA");
    const [selectedColor, setSelectedColor] = useState("#F44336");
    const [modalVisible, setModalVisible] = useState(false);
    const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
    const [loading, setLoading] = useState(isEditing);

    const IconComponent = PhosphorIcons[selectedIcon];

    const { create, update, show } = useHabitDatabase();
    const { create: createAffirmation } = useAffirmationDatabase();

    const DEFAULT_AFFIRMATIONS = [
        "Eu sou mais forte que meus impulsos.",
        "Cada dia sem recaída é uma vitória.",
        "Estou no controle das minhas escolhas.",
    ];

    // Carregar dados do hábito se estiver editando
    useEffect(() => {
        const loadHabitData = async () => {
            if (isEditing && habitId) {
                try {
                    setLoading(true);
                    const habitData = await show(habitId);
                    
                    if (habitData) {
                        setName(habitData.name || "");
                        setSelectedIcon(habitData.cover || "Star");
                        setSelectedColor(habitData.color || "#F44336");
                        setDefaultCurrency(habitData.default_currency || "AOA");
                        setTime(habitData.daily_spent_time || 0);
                        setAmount(habitData.daily_spent_money || 0);
                        setAmountDisplay(habitData.daily_spent_money ? habitData.daily_spent_money.toString().replace(".", ",") : "");
                        
                        // Formatar tempo
                        if (habitData.daily_spent_time > 0) {
                            const formatted = formatDuration(habitData.daily_spent_time);
                            setFormattedTime(formatted);
                        }
                        
                        // Carregar e formatar data
                        if (habitData.last_relapse_date) {
                            const habitDate = new Date(habitData.last_relapse_date);
                            setDate(habitDate);
                            
                            const formatted = new Intl.DateTimeFormat("pt-PT", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "UTC",
                            }).format(habitDate);
                            
                            setFormattedDate(formatted);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao carregar hábito:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados do hábito.");
                } finally {
                    setLoading(false);
                }
            } else {
                // Se não está editando, carregar parâmetros de criação
                const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
                const iconParam = Array.isArray(params.icon) ? params.icon[0] : params.icon;
                const colorParam = Array.isArray(params.color) ? params.color[0] : params.color;

                if (nameParam) {
                    setName(nameParam);
                }
                if (iconParam) {
                    setSelectedIcon(iconParam);
                }
                if (colorParam) {
                    setSelectedColor(colorParam);
                }
                setLoading(false);
            }
        };

        loadHabitData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Array vazio = executa apenas uma vez na montagem

    const handleSaveHabit = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "O nome do hábito é obrigatório.");
            return;
        }

        if (!date) {
            Alert.alert("Erro", "A data é obrigatória.");
            return;
        }

        try {
            if (isEditing && habitId) {
                // Atualizar hábito existente
                await update(habitId, {
                    name: name.trim(),
                    cover: selectedIcon,
                    color: selectedColor,
                    last_relapse_date: date,
                    daily_spent_time: time,
                    daily_spent_money: amount,
                    default_currency: defaultCurrency,
                });
            } else {
                // Criar novo hábito
                const newHabitId = await create({
                    name: name.trim(),
                    cover: selectedIcon,
                    color: selectedColor,
                    last_relapse_date: date,
                    daily_spent_time: time,
                    daily_spent_money: amount,
                    default_currency: defaultCurrency,
                });

                // Criar afirmações padrão automaticamente apenas para novos hábitos
                for (const text of DEFAULT_AFFIRMATIONS) {
                    await createAffirmation({ habit_id: newHabitId, text });
                }
            }

            router.back();
            if (!isEditing) {
                router.back(); // Voltar duas vezes apenas se estava criando (para sair do modal)
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar o hábito.");
        }
    };

    const showDateTimePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const showTimePicker = () => {
        // Sempre criar uma data completamente nova e independente
        // Usar uma data base fixa para garantir que não há dependência com a data selecionada
        const baseDate = new Date(2024, 0, 1, 0, 0, 0, 0); // Data fixa: 1 de janeiro de 2024, meia-noite
        if (time > 0) {
            // Converter minutos totais para horas e minutos
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            baseDate.setHours(hours, minutes, 0, 0);
        }
        // Criar uma nova instância completamente independente e isolada
        setTimePickerDate(new Date(baseDate.getTime()));
        setTimePickerVisibility(true);
    };

    const handleDateTimePickerConfirm = (selectedDate) => {
        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        
        // Verificar se a data selecionada é no futuro
        const now = new Date();
        if (localDate > now) {
            Alert.alert("Data inválida", "Não é possível selecionar uma data no futuro. Por favor, escolha uma data e hora no passado.");
            setDateTimePickerVisibility(false);
            return;
        }
        
        console.warn("A date has been picked: ", localDate);
        setDate(localDate);

        const formatted = new Intl.DateTimeFormat("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
        }).format(localDate);

        setFormattedDate(formatted);

        setDateTimePickerVisibility(false);
    };

    const handleTimePickerConfirm = (selectedTime) => {
        const hours = selectedTime.getHours();
        const minutes = selectedTime.getMinutes();

        const totalMinutes = hours * 60 + minutes;
        setTime(totalMinutes);

        // Criar uma nova data fixa com apenas as horas e minutos selecionados
        // Isso garante que não há dependência com qualquer outra data
        const newTimeDate = new Date(2024, 0, 1, hours, minutes, 0, 0);
        setTimePickerDate(newTimeDate);

        // Gera o texto formatado
        const formatted = formatDuration(totalMinutes);
        setFormattedTime(formatted);

        setTimePickerVisibility(false);
    };

    // Mostrar loading enquanto carrega dados do hábito
    if (loading) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: colors.background.primary }}
                contentContainerStyle={{
                    paddingBottom: 0,
                }}
                enableOnAndroid={true}
                extraScrollHeight={120}
                keyboardShouldPersistTaps="handled"
                enableAutomaticScroll={true}
                enableResetScrollToCoords={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={{
                            paddingTop: 32,
                            paddingBottom: 50,
                            paddingHorizontal: 16
                        }}
                    >

                        {/* Card principal */}
                        <View style={styles.mainCard}>
                            <TouchableOpacity
                                style={[styles.habitCard, { backgroundColor: selectedColor }]}
                                onPress={() => setModalVisible(true)}
                                activeOpacity={0.8}
                            >
                                <IconComponent size={28} color="#fff" weight="fill" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.nameInput}
                                placeholder="Nome do hábito"
                                placeholderTextColor={colors.gray[400]}
                                onChangeText={setName}
                                value={name}
                                editable={true}
                            />
                        </View>

                        {/* Seletor de cor */}
                        <View style={styles.colorRow}>
                            <FlatList
                                data={habitColors}
                                horizontal
                                keyExtractor={(item) => item}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12 }}
                                renderItem={({ item: color }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.selectedCircle,
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.group}>
                            <Title color="SECONDARY">
                                Quando fizeste pela última vez?
                            </Title>

                            <HabitInput
                                Icon={PhosphorIcons.CalendarDotsIcon}
                                iconWeight="regular"
                                title="Data"
                                rounded="full"
                                onPress={showDateTimePicker}
                                value={formattedDate || "Selecionar data e hora"}
                            />
                        </View>

                        <View style={styles.group}>
                            <Title color="SECONDARY">
                                Em média, quanto tempo gastas por dia?
                            </Title>

                            <HabitInput
                                Icon={PhosphorIcons.ClockIcon}
                                iconWeight="regular"
                                title="Tempo"
                                rounded="full"
                                onPress={showTimePicker}
                                value={formattedTime || "0 minutos"}
                            />
                        </View>

                        <View style={styles.group}>
                            <Title color="SECONDARY">
                                Em média, quanto dinheiro gastas por dia?
                            </Title>

                            <View>
                                <HabitNumericInput
                                    Icon={PhosphorIcons.CreditCardIcon}
                                    iconWeight="regular"
                                    title="Quantidade"
                                    value={amountDisplay}
                                    onChangeText={(text) => {
                                        // permite apenas números e vírgula
                                        const cleaned = text.replace(/[^0-9,]/g, "");
                                        setAmountDisplay(cleaned);
                                        // converte vírgula para ponto para salvar no banco
                                        const dbValue = parseFloat(cleaned.replace(",", ".")) || 0;
                                        setAmount(dbValue);
                                    }}
                                    keyboardType="decimal-pad"
                                    rounded="top"
                                />

                                <HabitInput
                                    Icon={PhosphorIcons.CurrencyCircleDollarIcon}
                                    iconWeight="regular"
                                    title="Moeda"
                                    rounded="bottom"
                                    onPress={() => setCurrencyModalVisible(true)}
                                    value={currencies.find(c => c.code === defaultCurrency)?.name || defaultCurrency}
                                />
                            </View>
                        </View>

                        <DateTimePickerModal
                            isVisible={isDateTimePickerVisible}
                            mode="datetime"
                            onConfirm={handleDateTimePickerConfirm}
                            onCancel={() => setDateTimePickerVisibility(false)}
                            confirmTextIOS="Confirmar"
                            cancelTextIOS="Cancelar"
                            display="spinner"
                            maximumDate={new Date()}
                        />

                        <DateTimePickerModal
                            key="time-picker-independent"
                            isVisible={isTimePickerVisible}
                            mode="time"
                            date={timePickerDate}
                            minimumDate={new Date(2024, 0, 1, 0, 0, 0, 0)}
                            maximumDate={new Date(2024, 0, 1, 23, 59, 0, 0)}
                            onConfirm={handleTimePickerConfirm}
                            onCancel={() => setTimePickerVisibility(false)}
                            confirmTextIOS="Confirmar"
                            cancelTextIOS="Cancelar"
                            display="spinner"
                        />



                        {/* Modal estilo bottom sheet */}
                        <Modal
                            visible={modalVisible}
                            transparent
                            animationType="slide"
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.bottomSheet}>
                                    <View style={styles.sheetHeader}>
                                        <Text style={styles.sheetTitle}>Escolhe um ícone</Text>
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Text style={styles.closeText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={iconCategories}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <View style={{ marginBottom: 20 }}>
                                                <Text style={styles.categoryTitle}>{item.title}</Text>
                                                <View style={styles.iconGrid}>
                                                    {item.icons.map((icon) => {
                                                        const Icon = PhosphorIcons[icon];
                                                        return (
                                                            <TouchableOpacity
                                                                key={icon}
                                                                style={[
                                                                    styles.iconOption,
                                                                    selectedIcon === icon && { backgroundColor: "#333" },
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedIcon(icon);
                                                                    setModalVisible(false);
                                                                }}
                                                            >
                                                                <Icon
                                                                    size={28}
                                                                    color={selectedIcon === icon ? "#fff" : "#333"}
                                                                    weight="fill"
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        )}
                                        showsVerticalScrollIndicator={false}
                                    />

                                </View>
                            </View>
                        </Modal>

                        {/* Modal de seleção de moeda */}
                        <Modal
                            visible={currencyModalVisible}
                            transparent
                            animationType="slide"
                            onRequestClose={() => setCurrencyModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.bottomSheet}>
                                    <View style={styles.sheetHeader}>
                                        <Text style={styles.sheetTitle}>Selecionar Moeda</Text>
                                        <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                                            <Text style={styles.closeText}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={currencies}
                                        keyExtractor={(item) => item.code}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.currencyOption,
                                                    defaultCurrency === item.code && styles.currencyOptionSelected,
                                                ]}
                                                onPress={() => {
                                                    setDefaultCurrency(item.code);
                                                    setCurrencyModalVisible(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.currencyCode,
                                                    defaultCurrency === item.code && styles.currencyCodeSelected,
                                                ]}>
                                                    {item.code}
                                                </Text>
                                                <Text style={[
                                                    styles.currencyName,
                                                    defaultCurrency === item.code && styles.currencyNameSelected,
                                                ]}>
                                                    {item.name}
                                                </Text>
                                                {item.symbol && (
                                                    <Text style={[
                                                        styles.currencySymbol,
                                                        defaultCurrency === item.code && styles.currencySymbolSelected,
                                                    ]}>
                                                        {item.symbol}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>


                </TouchableWithoutFeedback>

            </KeyboardAwareScrollView>
            <View style={styles.footer}>
                <PrimaryButton
                    label={loading ? t("common.loading") : (isEditing ? t("common.save") : t("common.finish"))}
                    onPress={handleSaveHabit}
                    disabled={loading}
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: colors.background.primary,
    },
    heading: {
        fontSize: 24,
        fontFamily: fontFamily.medium,
        marginBottom: 20,
    },
    mainCard: {
        flexDirection: 'row',
        gap: 12,
        width: '100%'
    },
    habitCard: {
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 999,
    },
    nameInput: {
        height: 56,
        flex: 1,
        borderRadius: 12,
        fontSize: 16,
        padding: 16,
        backgroundColor: colors.background.secondary,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
    habitLabel: {
        color: "#fff",
        fontSize: 16,
        fontFamily: fontFamily.medium,
    },
    label: {
        fontSize: 16,
        color: colors.text.secondary,
        marginBottom: 12,
        marginTop: 24,
    },
    colorRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 20,
        gap: 12,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 999,
    },
    selectedCircle: {
        borderWidth: 3,
        borderColor: "#333",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 30,
        maxHeight: "70%",
    },
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: fontFamily.semibold,
    },
    closeText: {
        fontSize: 14,
        color: "#666",
        fontFamily: fontFamily.medium,
    },
    categoryTitle: {
        fontSize: 14,
        color: "#888",
        marginBottom: 6,
        fontFamily: fontFamily.medium,
    },
    iconGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    iconOption: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    group: {
        gap: 12,
        marginTop: 24
    },
    footer: {
        width: '100%',
        backgroundColor: colors.background.primary,
        paddingBottom: 24,
        paddingHorizontal: 16,
    },
    currencyOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: colors.background.secondary,
    },
    currencyOptionSelected: {
        backgroundColor: colors.gray[100],
    },
    currencyCode: {
        fontSize: 16,
        fontFamily: fontFamily.semibold,
        color: colors.text.primary,
        width: 60,
    },
    currencyCodeSelected: {
        color: colors.text.primary,
    },
    currencyName: {
        flex: 1,
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
    },
    currencyNameSelected: {
        color: colors.text.primary,
    },
    currencySymbol: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
        marginLeft: 8,
    },
    currencySymbolSelected: {
        color: colors.text.primary,
    },
});
