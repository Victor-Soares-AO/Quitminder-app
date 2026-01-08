import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";

/**
 * FUNÇÃO CENTRALIZADA: getLastRelapse()
 * 
 * PROBLEMA IDENTIFICADO:
 * O sistema não estava usando a recaída cronologicamente mais recente.
 * Alguns lugares usavam find() sem ordenação, outros assumiam ordem do array.
 * 
 * REGRA DE NEGÓCIO:
 * 1. A última recaída é SEMPRE o registro com is_reset === 1
 *    cuja data é a mais recente no tempo.
 * 2. A ordem original dos registros NUNCA deve ser assumida.
 * 3. Se não houver recaídas, retornar null.
 * 
 * @param records - Todos os registros do hábito (ordem não importa)
 * @returns Registro da última recaída ou null se não houver recaídas
 */
export function getLastRelapse(records: HabitRecordResponse[]): HabitRecordResponse | null {
    if (!records || records.length === 0) {
        return null;
    }
    
    // Filtrar apenas recaídas (is_reset === 1)
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) {
        return null;
    }
    
    // Ordenar por data_time DESC (mais recente primeiro)
    // NUNCA assumir ordem do array original
    const sortedRelapses = [...relapses].sort((a, b) => {
        const dateA = new Date(a.date_time).getTime();
        const dateB = new Date(b.date_time).getTime();
        return dateB - dateA; // DESC: mais recente primeiro
    });
    
    // Retornar o registro completo da recaída mais recente
    return sortedRelapses[0];
}

/**
 * Retorna a data da última recaída (compatibilidade)
 * 
 * @param records - Todos os registros do hábito
 * @returns Data da última recaída (string ISO) ou null se não houver recaídas
 */
export function calculateLastRelapseDate(records: HabitRecordResponse[]): string | null {
    const lastRelapse = getLastRelapse(records);
    return lastRelapse ? lastRelapse.date_time : null;
}

/**
 * Calcula o período atual de abstinência baseado no último reset real
 * 
 * @param records - Todos os registros do hábito
 * @returns Período em milissegundos desde a última recaída, ou null se não houver recaídas
 */
export function calculateCurrentAbstinencePeriod(records: HabitRecordResponse[]): number | null {
    const lastRelapse = getLastRelapse(records);
    
    if (!lastRelapse) {
        return null;
    }
    
    const lastRelapseDate = new Date(lastRelapse.date_time);
    const now = new Date();
    
    return now.getTime() - lastRelapseDate.getTime();
}

/**
 * Calcula o número de dias desde a última recaída (streak atual)
 * 
 * @param records - Todos os registros do hábito
 * @returns Número de dias em abstinência, ou null se não houver recaídas
 */
export function calculateDaysSinceLastRelapse(records: HabitRecordResponse[]): number | null {
    const lastRelapse = getLastRelapse(records);
    
    if (!lastRelapse) {
        return null;
    }
    
    // Normalizar datas para meia-noite local para cálculo preciso de dias
    const lastRelapseDate = new Date(lastRelapse.date_time);
    lastRelapseDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffMs = today.getTime() - lastRelapseDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays : 0;
}

/**
 * Retorna todas as recaídas ordenadas cronologicamente (mais antiga primeiro)
 * 
 * @param records - Todos os registros do hábito
 * @returns Array de recaídas ordenadas por data (ASC)
 */
export function getAllRelapsesOrdered(records: HabitRecordResponse[]): HabitRecordResponse[] {
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) {
        return [];
    }
    
    // Ordenar por data ASC (mais antiga primeiro)
    return [...relapses].sort((a, b) => {
        const dateA = new Date(a.date_time).getTime();
        const dateB = new Date(b.date_time).getTime();
        return dateA - dateB; // ASC: mais antiga primeiro
    });
}

