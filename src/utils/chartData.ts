import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { getAllRelapsesOrdered } from "./calculateLastRelapse";

export type DayOfWeekData = {
    day: string;
    shortDay: string;
    count: number;
};

export type PeriodOfDayData = {
    period: string;
    count: number;
};

export type IntervalData = {
    date: string;
    interval: number; // em dias
};

/**
 * Processa dados de recaídas por dia da semana
 * Usa função centralizada para garantir ordenação correta
 */
export function getRelapsesByDayOfWeek(records: HabitRecordResponse[]): DayOfWeekData[] {
    const relapses = getAllRelapsesOrdered(records);
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const shortDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    const dayCount: Record<number, number> = {};
    
    relapses.forEach(record => {
        const date = new Date(record.date_time);
        const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
        dayCount[dayOfWeek] = (dayCount[dayOfWeek] || 0) + 1;
    });

    return dayNames.map((day, index) => ({
        day,
        shortDay: shortDayNames[index],
        count: dayCount[index] || 0,
    }));
}

/**
 * Processa dados de recaídas por período do dia
 * Usa função centralizada para garantir ordenação correta
 */
export function getRelapsesByPeriodOfDay(records: HabitRecordResponse[]): PeriodOfDayData[] {
    const relapses = getAllRelapsesOrdered(records);
    
    const periodCount: Record<string, number> = {
        'Madrugada': 0,
        'Manhã': 0,
        'Tarde': 0,
        'Noite': 0,
    };

    relapses.forEach(record => {
        const date = new Date(record.date_time);
        const hour = date.getHours();
        
        if (hour >= 0 && hour < 6) {
            periodCount['Madrugada']++;
        } else if (hour >= 6 && hour < 12) {
            periodCount['Manhã']++;
        } else if (hour >= 12 && hour < 18) {
            periodCount['Tarde']++;
        } else {
            periodCount['Noite']++;
        }
    });

    return [
        { period: 'Madrugada', count: periodCount['Madrugada'] },
        { period: 'Manhã', count: periodCount['Manhã'] },
        { period: 'Tarde', count: periodCount['Tarde'] },
        { period: 'Noite', count: periodCount['Noite'] },
    ];
}

/**
 * Processa dados de intervalo entre recaídas ao longo do tempo
 * Calcula intervalos SOMENTE entre recaídas reais (diferença entre recaída N e recaída N-1)
 * Usa função centralizada para garantir ordenação cronológica correta
 */
export function getIntervalsBetweenRelapses(records: HabitRecordResponse[]): IntervalData[] {
    // Usar função centralizada que já ordena corretamente (ASC: mais antiga primeiro)
    const relapses = getAllRelapsesOrdered(records);

    if (relapses.length < 2) {
        return [];
    }

    const intervals: IntervalData[] = [];
    
    // Calcular intervalos entre recaídas consecutivas
    // relapses já está ordenado cronologicamente (mais antiga primeiro)
    for (let i = 1; i < relapses.length; i++) {
        const prevDate = new Date(relapses[i - 1].date_time);
        const currentDate = new Date(relapses[i].date_time);
        
        // Normalizar para meia-noite local para cálculo preciso de dias
        prevDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        const diffMs = currentDate.getTime() - prevDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        intervals.push({
            date: relapses[i].date_time,
            interval: Math.round(diffDays * 10) / 10, // Arredondar para 1 casa decimal
        });
    }

    return intervals;
}

