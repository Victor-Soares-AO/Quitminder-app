import { useEffect } from "react";
import { getNotificationSettings, scheduleDailyNotification } from "@/services/notifications";
import { useLanguage } from "@/contexts/useLanguage";

/**
 * Hook para inicializar notificações quando o app abre
 * Verifica se há notificações habilitadas e as reagenda se necessário
 */
export function useNotificationsInit() {
    const { language } = useLanguage();

    useEffect(() => {
        const initNotifications = async () => {
            try {
                const settings = await getNotificationSettings();
                
                // Se as notificações estão habilitadas e há um horário definido, reagendar
                if (settings.enabled && settings.time) {
                    await scheduleDailyNotification(settings.time, language);
                }
            } catch (error) {
                console.error("Erro ao inicializar notificações:", error);
            }
        };

        initNotifications();
    }, [language]);
}

