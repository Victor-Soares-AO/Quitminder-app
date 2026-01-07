import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";

export type DayOfWeek = 'domingo' | 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado';

export type TimeOfDay = 'madrugada' | 'manhã' | 'tarde' | 'noite';

export type RiskLevel = 'Baixo' | 'Médio' | 'Alto';

export type JourneyAnalysis = {
    riskScore: number;
    riskLevel: RiskLevel;
    mostRelapseDay: DayOfWeek | null;
    mostCriticalPeriod: TimeOfDay | null;
    averageIntervalBetweenRelapses: number | null; // em dias
    frequentTriggers: string[];
};

/**
 * Identifica o dia da semana com maior número de recaídas
 */
export function getMostRelapseDay(records: HabitRecordResponse[]): DayOfWeek | null {
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) return null;

    const dayCount: Record<number, number> = {};
    
    relapses.forEach(record => {
        const date = new Date(record.date_time);
        const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
        dayCount[dayOfWeek] = (dayCount[dayOfWeek] || 0) + 1;
    });

    const mostFrequentDay = Object.entries(dayCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (!mostFrequentDay) return null;

    const dayNames: DayOfWeek[] = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    return dayNames[parseInt(mostFrequentDay)];
}

/**
 * Identifica o período do dia mais crítico (manhã, tarde, noite, madrugada)
 */
export function getMostCriticalPeriod(records: HabitRecordResponse[]): TimeOfDay | null {
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) return null;

    const periodCount: Record<TimeOfDay, number> = {
        madrugada: 0,
        manhã: 0,
        tarde: 0,
        noite: 0,
    };

    relapses.forEach(record => {
        const date = new Date(record.date_time);
        const hour = date.getHours();
        
        if (hour >= 0 && hour < 6) {
            periodCount.madrugada++;
        } else if (hour >= 6 && hour < 12) {
            periodCount.manhã++;
        } else if (hour >= 12 && hour < 18) {
            periodCount.tarde++;
        } else {
            periodCount.noite++;
        }
    });

    const mostFrequentPeriod = Object.entries(periodCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as TimeOfDay;

    return mostFrequentPeriod || null;
}

/**
 * Calcula o intervalo médio, em dias, entre recaídas
 */
export function getAverageIntervalBetweenRelapses(records: HabitRecordResponse[]): number | null {
    const relapses = records
        .filter(r => r.is_reset === 1)
        .map(r => new Date(r.date_time).getTime())
        .sort((a, b) => a - b);

    if (relapses.length < 2) return null;

    const intervals: number[] = [];
    
    for (let i = 1; i < relapses.length; i++) {
        const diffMs = relapses[i] - relapses[i - 1];
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        intervals.push(diffDays);
    }

    const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return Math.round(average * 10) / 10; // Arredondar para 1 casa decimal
}

/**
 * Identifica gatilhos recorrentes a partir dos campos note e title
 * Retorna até 3 termos mais frequentes
 */
export function getFrequentTriggers(records: HabitRecordResponse[], limit: number = 3): string[] {
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) return [];

    // Palavras comuns a ignorar (stop words em português)
    const stopWords = new Set([
        'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por', 'que',
        'se', 'não', 'mais', 'foi', 'são', 'como', 'mas', 'ou', 'ser', 'ter', 'estar',
        'foi', 'tem', 'era', 'foram', 'pode', 'pode', 'quando', 'onde', 'porque', 'então',
        'isso', 'isso', 'aqui', 'ali', 'lá', 'meu', 'minha', 'meus', 'minhas', 'nosso',
        'nossa', 'você', 'ele', 'ela', 'eles', 'elas', 'eu', 'nós', 'vocês'
    ]);

    // Extrair palavras de title e note
    const wordCount: Record<string, number> = {};
    
    relapses.forEach(record => {
        const text = `${record.title || ''} ${record.note || ''}`.toLowerCase();
        const words = text
            .replace(/[^\w\s]/g, ' ') // Remove pontuação
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word));

        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
    });

    // Ordenar por frequência e retornar os mais comuns
    const sortedWords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    return sortedWords;
}

/**
 * Calcula o Índice de Risco Diário (0-100) e classifica como Baixo, Médio ou Alto
 */
export function calculateRiskScore(records: HabitRecordResponse[]): { score: number; level: RiskLevel } {
    const relapses = records.filter(r => r.is_reset === 1);
    
    if (relapses.length === 0) {
        return { score: 0, level: 'Baixo' };
    }

    // Fatores de risco
    let riskScore = 0;

    // 1. Frequência de recaídas (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRelapses = relapses.filter(r => {
        const date = new Date(r.date_time);
        return date >= thirtyDaysAgo;
    }).length;

    // Máximo 40 pontos por frequência (mais de 5 recaídas = 40 pontos)
    riskScore += Math.min(recentRelapses * 8, 40);

    // 2. Proximidade da última recaída (quanto mais recente, maior o risco)
    const lastRelapse = relapses
        .map(r => new Date(r.date_time).getTime())
        .sort((a, b) => b - a)[0];

    if (lastRelapse) {
        const daysSinceLastRelapse = (Date.now() - lastRelapse) / (1000 * 60 * 60 * 24);
        
        // Se foi há menos de 7 dias, risco alto (até 30 pontos)
        if (daysSinceLastRelapse < 7) {
            riskScore += 30;
        } else if (daysSinceLastRelapse < 14) {
            riskScore += 20;
        } else if (daysSinceLastRelapse < 30) {
            riskScore += 10;
        }
    }

    // 3. Padrão de recaídas (se há um padrão claro, risco aumenta)
    const averageInterval = getAverageIntervalBetweenRelapses(records);
    if (averageInterval !== null && averageInterval < 7) {
        riskScore += 15; // Intervalo médio menor que 7 dias
    } else if (averageInterval !== null && averageInterval < 14) {
        riskScore += 10;
    }

    // 4. Recência temporal (se houve recaída hoje ou ontem)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const veryRecentRelapses = relapses.filter(r => {
        const date = new Date(r.date_time);
        date.setHours(0, 0, 0, 0);
        return date >= yesterday;
    }).length;

    if (veryRecentRelapses > 0) {
        riskScore += 15;
    }

    // Garantir que o score está entre 0 e 100
    riskScore = Math.min(Math.max(riskScore, 0), 100);

    // Classificar o nível de risco
    let level: RiskLevel;
    if (riskScore < 30) {
        level = 'Baixo';
    } else if (riskScore < 60) {
        level = 'Médio';
    } else {
        level = 'Alto';
    }

    return { score: Math.round(riskScore), level };
}

/**
 * Função principal que realiza toda a análise da jornada
 */
export function analyzeJourney(records: HabitRecordResponse[]): JourneyAnalysis {
    const { score, level } = calculateRiskScore(records);
    
    return {
        riskScore: score,
        riskLevel: level,
        mostRelapseDay: getMostRelapseDay(records),
        mostCriticalPeriod: getMostCriticalPeriod(records),
        averageIntervalBetweenRelapses: getAverageIntervalBetweenRelapses(records),
        frequentTriggers: getFrequentTriggers(records, 3),
    };
}

