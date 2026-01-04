import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert, Switch, Text } from "react-native";
import { router } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClockIcon, X } from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { HabitInput } from "@/components/HabitInput";
import { IconButton } from "@/components/IconButton";

import { colors, fontFamily } from "@/theme";
import { useTranslation } from "@/hooks/useTranslation";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/useLanguage";
import { 
    getNotificationSettings, 
    saveNotificationSettings, 
    scheduleDailyNotification, 
    cancelAllNotifications 
} from "@/services/notifications";

export default function NotificationsSettings() {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const colors = useColors();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationTime, setNotificationTime] = useState<Date | null>(null);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        try {
            const settings = await getNotificationSettings();
            setNotificationsEnabled(settings.enabled);
            
            if (settings.time) {
                setNotificationTime(settings.time);
                formatTime(settings.time);
            } else {
                // Horário padrão: 09:00
                const defaultTime = new Date();
                defaultTime.setHours(9, 0, 0, 0);
                setNotificationTime(defaultTime);
                formatTime(defaultTime);
            }
        } catch (error) {
            console.error("Erro ao carregar configurações de notificação:", error);
        }
    };

    const formatTime = (time: Date) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        setFormattedTime(`${hours}:${minutes}`);
    };

    const handleToggleNotifications = async (value: boolean) => {
        try {
            await saveNotificationSettings(value, notificationTime);
            setNotificationsEnabled(value);
            
            if (value && notificationTime) {
                // Se está ativando, agendar notificação
                await scheduleDailyNotification(notificationTime, language);
            } else {
                // Se está desativando, cancelar notificações
                await cancelAllNotifications();
            }
        } catch (error) {
            console.error("Erro ao alterar notificações:", error);
            Alert.alert(t("common.error"), "Não foi possível alterar as notificações.");
        }
    };

    const handleTimeChange = async (selectedTime: Date) => {
        try {
            setNotificationTime(selectedTime);
            formatTime(selectedTime);
            await saveNotificationSettings(notificationsEnabled, selectedTime);
            setTimePickerVisible(false);

            // Se as notificações estão ativas, reagendar
            if (notificationsEnabled) {
                await cancelAllNotifications();
                await scheduleDailyNotification(selectedTime, language);
            }
        } catch (error) {
            console.error("Erro ao salvar horário:", error);
            Alert.alert(t("common.error"), "Não foi possível salvar o horário.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Header transparent>
            </Header>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                <Heading fontSize="LARGE" style={styles.heading}>
                    {t("settings.notifications")}
                </Heading>

                <Description style={styles.description}>
                    Receba lembretes diários para acompanhar seus hábitos e manter sua motivação.
                </Description>
                </View>

                <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
                    <View style={styles.switchRow}>
                        <View style={styles.switchInfo}>
                            <Title fontSize="LARGE">Ativar Notificações</Title>
                            <Description>
                                Receba lembretes diários sobre seus hábitos
                            </Description>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggleNotifications}
                            trackColor={{ false: colors.gray[300], true: colors.text.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                </View>

                {notificationsEnabled && (
                    <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
                        <Title fontSize="MEDIUM" style={styles.sectionTitle}>
                            Horário da Notificação
                        </Title>
                        <Description style={styles.sectionDescription}>
                            Escolha o horário em que deseja receber os lembretes diários
                        </Description>
                        <HabitInput
                            Icon={ClockIcon}
                            iconWeight="regular"
                            title="Horário"
                            rounded="full"
                            onPress={() => setTimePickerVisible(true)}
                            value={formattedTime || "09:00"}
                        />
                    </View>
                )}

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeChange}
                    onCancel={() => setTimePickerVisible(false)}
                    confirmTextIOS="Confirmar"
                    cancelTextIOS="Cancelar"
                    display="spinner"
                    date={notificationTime || new Date()}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 80,
        paddingBottom: 40,
    },
    heading: {
        marginBottom: 8,
    },
    header: {
        marginBottom: 24,
    },
    description: {
        marginBottom: 32,
    },
    section: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    switchInfo: {
        flex: 1,
        marginRight: 16,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    sectionDescription: {
        marginBottom: 16,
    },
});

