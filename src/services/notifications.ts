import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

const NOTIFICATIONS_ENABLED_KEY = '@QuitMinder:notificationsEnabled';
const NOTIFICATION_TIME_KEY = '@QuitMinder:notificationTime';
const NOTIFICATION_ID_KEY = '@QuitMinder:notificationId';

// Mensagens motivacionais em português
const MOTIVATIONAL_MESSAGES_PT = [
    "Você está no caminho certo! Continue acompanhando seus hábitos hoje.",
    "Cada dia sem recaída é uma vitória. Você consegue!",
    "Lembre-se: você é mais forte que seus impulsos. Acompanhe seu progresso.",
    "Seu futuro agradece pelas escolhas de hoje. Continue firme!",
    "Você está construindo uma versão melhor de si mesmo. Não desista!",
    "Cada momento de resistência te torna mais forte. Acompanhe seus hábitos.",
    "Você já chegou tão longe! Continue acompanhando seu progresso.",
    "A jornada de mil milhas começa com um passo. Você já começou!",
    "Seu compromisso com a mudança é inspirador. Continue assim!",
    "Lembre-se das suas razões. Você tem o poder de mudar!",
];

// Mensagens motivacionais em inglês
const MOTIVATIONAL_MESSAGES_EN = [
    "You're on the right track! Keep tracking your habits today.",
    "Every day without relapse is a victory. You can do it!",
    "Remember: you are stronger than your impulses. Track your progress.",
    "Your future thanks you for today's choices. Keep going!",
    "You're building a better version of yourself. Don't give up!",
    "Every moment of resistance makes you stronger. Track your habits.",
    "You've come so far! Keep tracking your progress.",
    "A journey of a thousand miles begins with a single step. You've started!",
    "Your commitment to change is inspiring. Keep it up!",
    "Remember your reasons. You have the power to change!",
];

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationSettings {
    enabled: boolean;
    time: Date | null;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
    try {
        const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
        const timeStr = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
        
        let time: Date | null = null;
        if (timeStr) {
            time = new Date(timeStr);
        } else {
            // Horário padrão: 09:00
            time = new Date();
            time.setHours(9, 0, 0, 0);
        }

        return {
            enabled: enabled === 'true',
            time,
        };
    } catch (error) {
        console.error("Erro ao carregar configurações de notificação:", error);
        return {
            enabled: false,
            time: null,
        };
    }
}

export async function saveNotificationSettings(enabled: boolean, time: Date | null): Promise<void> {
    try {
        await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? 'true' : 'false');
        if (time) {
            await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, time.toISOString());
        }
    } catch (error) {
        console.error("Erro ao salvar configurações de notificação:", error);
        throw error;
    }
}

export async function cancelAllNotifications(): Promise<void> {
    try {
        // Cancelar todas as notificações agendadas
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // Remover o ID salvo
        await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
        
        console.log("Todas as notificações foram canceladas");
    } catch (error) {
        console.error("Erro ao cancelar notificações:", error);
        throw error;
    }
}

export async function requestPermissions(): Promise<boolean> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            console.warn('Permissão de notificação não concedida');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Erro ao solicitar permissões de notificação:", error);
        return false;
    }
}

function getRandomMessage(language: string = 'pt'): string {
    const messages = language === 'en' ? MOTIVATIONAL_MESSAGES_EN : MOTIVATIONAL_MESSAGES_PT;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

export async function scheduleDailyNotification(time: Date, language: string = 'pt'): Promise<void> {
    try {
        // Solicitar permissões primeiro
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            throw new Error('Permissão de notificação não concedida');
        }

        // Cancelar notificações anteriores
        await cancelAllNotifications();

        const hours = time.getHours();
        const minutes = time.getMinutes();
        
        // Obter mensagem motivacional aleatória
        const message = getRandomMessage(language);
        
        // Agendar notificação diária
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: language === 'en' ? "Habit Reminder" : "QuitMinder",
                body: message,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });

        // Salvar o ID da notificação para poder cancelar depois
        await AsyncStorage.setItem(NOTIFICATION_ID_KEY, notificationId.toString());
        
        console.log(`Notificação diária agendada para ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    } catch (error) {
        console.error("Erro ao agendar notificação:", error);
        throw error;
    }
}

