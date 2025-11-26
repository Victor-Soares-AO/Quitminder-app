import { router } from "expo-router";
import React, { useState } from "react";
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
    ScrollView
} from "react-native";

import * as PhosphorIcons from "phosphor-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Header } from "@/components/Header";
import { Title } from "@/components/Text/Title";
import { HabitInput } from "@/components/HabitInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HabitNumericInput } from "@/components/Inputs/HabitNumericInput";

import { colors, fontFamily } from "@/theme";
import { habitColors } from "@/utils/habitColors";
import { formatDuration } from "@/utils/formatDuration";
import { useHabitDatabase } from "@/database/useHabitDatabase";
import { getIconCategories } from "@/constants/icons/getIconCategories";

export default function EditHabit() {

    const insets = useSafeAreaInsets();

    const lang = "pt";
    const iconCategories = getIconCategories(lang);

    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("Star");

    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [date, setDate] = useState<Date>(null);
    const [time, setTime] = useState(0);
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedTime, setFormattedTime] = useState("");
    const [amount, setAmount] = useState(0);
    const [amountDisplay, setAmountDisplay] = useState(0);
    const [defaultCurrency, setDefaultCurrency] = useState("AOA");
    const [selectedColor, setSelectedColor] = useState("#F44336");
    const [modalVisible, setModalVisible] = useState(false);

    const IconComponent = PhosphorIcons[selectedIcon];

    const { create } = useHabitDatabase();

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
            await create({
                name: name.trim(),
                cover: selectedIcon,
                color: selectedColor,
                last_relapse_date: date,
                daily_spent_time: time,
                daily_spent_money: amount,
                default_currency: defaultCurrency,
            });

            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar o hábito.");
        }
    };



    const showDateTimePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const handleDateTimePickerConfirm = (selectedDate) => {
        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
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

        // Gera o texto formatado
        const formatted = formatDuration(totalMinutes);
        setFormattedTime(formatted);

        setTimePickerVisibility(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header label="Adicionar" />

            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: colors.background.primary }}
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
                enableOnAndroid={true}
                extraScrollHeight={100} // distância extra para garantir visibilidade
                keyboardShouldPersistTaps="handled"
                enableAutomaticScroll={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{
                            paddingTop: 80,
                            paddingBottom: 50,
                            paddingHorizontal: 16
                        }}
                        keyboardShouldPersistTaps="handled"
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
                                onChangeText={setName}
                                value={name}
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
                                {/* <HabitInput
                                Icon={PhosphorIcons.CreditCardIcon}
                                iconWeight="bold"
                                title="Quantidade"
                                rounded="top"
                            /> */}

                                <HabitNumericInput
                                    Icon={PhosphorIcons.CreditCardIcon}
                                    iconWeight="regular"
                                    title="Quantidade"
                                    value={amountDisplay.toString()} // mantém string para exibir vírgula
                                    onChangeText={(text) => {
                                        // permite apenas números e vírgula
                                        const cleaned = text.replace(/[^0-9,]/g, "");

                                        //setAmountDisplay(cleaned); // ⚠️ mantém como string

                                        // converte vírgula para ponto para salvar no banco
                                        const dbValue = parseFloat(cleaned.replace(",", ".")) || 0;
                                        setAmount(dbValue);
                                    }}
                                    // keyboardType="decimal-pad"
                                    rounded="top"
                                />

                                <HabitInput
                                    Icon={PhosphorIcons.CurrencyCircleDollarIcon}
                                    iconWeight="regular"
                                    title="Moeda"
                                    rounded="bottom"
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

                                    {/* <FlatList
                                        data={Object.entries(iconCategories)}
                                        keyExtractor={([category]) => category}
                                        renderItem={({ item: [category, icons] }) => (
                                            <View style={{ marginBottom: 20 }}>
                                                <Text style={styles.categoryTitle}>{category}</Text>
                                                <View style={styles.iconGrid}>
                                                    {icons.map((icon) => {
                                                        const Icon = PhosphorIcons[icon];
                                                        return (
                                                            <TouchableOpacity
                                                                key={icon}
                                                                style={[
                                                                    styles.iconOption,
                                                                    selectedIcon === icon && {
                                                                        backgroundColor: "#333",
                                                                    },
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedIcon(icon);
                                                                    setModalVisible(false);
                                                                }}
                                                            >
                                                                <Icon
                                                                    size={28}
                                                                    color={
                                                                        selectedIcon === icon ? "#fff" : "#333"
                                                                    }
                                                                    weight="fill"
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        )}
                                        showsVerticalScrollIndicator={false}
                                    /> */}

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
                    </ScrollView>


                </TouchableWithoutFeedback>

            </KeyboardAwareScrollView>
            <View style={styles.footer}>
                <PrimaryButton
                    label="Concluir"
                    onPress={handleSaveHabit}
                />
            </View>
        </SafeAreaView >
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
        // width: "100%",
        flex: 1,
        borderRadius: 12,
        fontSize: 16,
        padding: 16,
        backgroundColor: colors.background.secondary
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
        // position: 'absolute',
        paddingBottom: 24,
        paddingHorizontal: 16,
    }
});