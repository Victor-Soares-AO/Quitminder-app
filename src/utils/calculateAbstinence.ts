import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { calculateCurrentAbstinencePeriod } from "./calculateLastRelapse";

/**
 * Calcula o período de abstinência
 * 
 * @param lastRelapseDate - Data da última recaída (pode ser string ou null)
 * @param records - Opcional: registros para cálculo preciso do último reset
 * @returns String formatada do período de abstinência
 */
export function calculateAbstinence(
    lastRelapseDate: string | null | undefined,
    records?: HabitRecordResponse[]
): string {
    // Se records fornecidos, usar cálculo preciso do último reset
    if (records && records.length > 0) {
        const periodMs = calculateCurrentAbstinencePeriod(records);
        if (periodMs === null) {
            return "—";
        }
        return formatPeriod(periodMs);
    }
    
    // Fallback: usar lastRelapseDate fornecido
    if (!lastRelapseDate) {
        return "—";
    }

    const now = new Date();
    const relapse = new Date(lastRelapseDate);

    const diffMs = now.getTime() - relapse.getTime();
    if (diffMs < 0) return "—";

    return formatPeriod(diffMs);
}

/**
 * Formata período em milissegundos para string legível
 */
function formatPeriod(diffMs: number): string {
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d  ${hours}h  ${minutes}m  ${seconds}s`;
}