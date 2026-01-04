import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { formatDuration } from "./formatDuration";

export type Statistics = {
    totalRelapses: number;
    minAbstinencePeriod: string;
    avgAbstinencePeriod: string;
    maxAbstinencePeriod: string;
    totalTimeSpent: string;
    totalMoneySpent: string;
    currency: string;
};

function formatAbstinencePeriod(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) {
        return `${days} dia${days !== 1 ? "s" : ""}, ${hours} hora${hours !== 1 ? "s" : ""}, ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    }
    if (hours > 0) {
        return `${hours} hora${hours !== 1 ? "s" : ""}, ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    }
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
}

export function calculateStatistics(
    records: HabitRecordResponse[],
    habitCreatedAt: string,
    habitLastRelapseDate: string | null
): Statistics {
    // Filtrar apenas recaídas (is_reset = 1) e ordenar por data
    const relapses = records
        .filter((r) => r.is_reset === 1)
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    const totalRelapses = relapses.length;

    // Calcular períodos de abstinência
    const abstinencePeriods: number[] = [];
    const habitStartDate = new Date(habitCreatedAt);

    if (relapses.length === 0) {
        // Se não há recaídas, o período é desde a criação até agora (ou até a última recaída se houver)
        const endDate = habitLastRelapseDate ? new Date(habitLastRelapseDate) : new Date();
        const period = endDate.getTime() - habitStartDate.getTime();
        if (period > 0) {
            abstinencePeriods.push(period);
        }
    } else {
        // Período inicial: da criação até a primeira recaída
        const firstRelapse = new Date(relapses[0].date_time);
        const initialPeriod = firstRelapse.getTime() - habitStartDate.getTime();
        if (initialPeriod > 0) {
            abstinencePeriods.push(initialPeriod);
        }

        // Períodos entre recaídas
        for (let i = 1; i < relapses.length; i++) {
            const prevRelapse = new Date(relapses[i - 1].date_time);
            const currentRelapse = new Date(relapses[i].date_time);
            const period = currentRelapse.getTime() - prevRelapse.getTime();
            if (period > 0) {
                abstinencePeriods.push(period);
            }
        }

        // Período final: da última recaída até agora (ou até habitLastRelapseDate se diferente)
        const lastRelapse = new Date(relapses[relapses.length - 1].date_time);
        const endDate = new Date(); // Sempre usar a data atual para o período final
        const finalPeriod = endDate.getTime() - lastRelapse.getTime();
        if (finalPeriod > 0) {
            abstinencePeriods.push(finalPeriod);
        }
    }

    // Calcular min, avg, max
    let minAbstinencePeriod = "—";
    let avgAbstinencePeriod = "—";
    let maxAbstinencePeriod = "—";

    if (abstinencePeriods.length > 0) {
        const min = Math.min(...abstinencePeriods);
        const max = Math.max(...abstinencePeriods);
        const avg = abstinencePeriods.reduce((sum, p) => sum + p, 0) / abstinencePeriods.length;

        minAbstinencePeriod = formatAbstinencePeriod(min);
        avgAbstinencePeriod = formatAbstinencePeriod(avg);
        maxAbstinencePeriod = formatAbstinencePeriod(max);
    }

    // Calcular tempo total gasto
    const totalTimeSpentMinutes = records.reduce((sum, r) => sum + (r.time_spent || 0), 0);
    const totalTimeSpent = formatDuration(totalTimeSpentMinutes);

    // Calcular dinheiro total gasto
    const totalMoneySpent = records.reduce((sum, r) => sum + (r.money_spent || 0), 0);
    const currency = records.find((r) => r.currency)?.currency || "KZ";

    return {
        totalRelapses,
        minAbstinencePeriod,
        avgAbstinencePeriod,
        maxAbstinencePeriod,
        totalTimeSpent,
        totalMoneySpent: totalMoneySpent.toFixed(2),
        currency,
    };
}

