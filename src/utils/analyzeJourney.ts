import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { extractSemanticTriggers, Trigger } from "@/utils/extractTriggers";
import { canonicalizeTrigger } from "@/utils/canonicalizeTriggers";
import { getAllRelapsesOrdered, getLastRelapse } from "./calculateLastRelapse";
import { generateContextualSuggestion } from "./generateContextualSuggestion";

export type DayOfWeek = 'domingo' | 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado';

export type TimeOfDay = 'madrugada' | 'manhã' | 'tarde' | 'noite';

export type RiskLevel = 'Baixo' | 'Médio' | 'Alto';

export type CombinedInsight = {
    text: string;
    triggers: Array<{ label: string; type: string }>;
};

export type ContextualSuggestion = {
    text: string;
    category: string;
};

export type JourneyAnalysis = {
    riskScore: number;
    riskLevel: RiskLevel;
    mostRelapseDay: DayOfWeek | null;
    mostCriticalPeriod: TimeOfDay | null;
    averageIntervalBetweenRelapses: number | null; // em dias
    frequentTriggers: string[]; // Mantido para compatibilidade
    semanticTriggers?: Trigger[]; // Novos gatilhos semânticos
    combinedInsights?: CombinedInsight[]; // Insights combinados de múltiplos gatilhos
    contextualSuggestion?: ContextualSuggestion | null; // Sugestão contextual baseada no estado atual
};

/**
 * Identifica o dia da semana com maior número de recaídas
 */

export function getMostRelapseDay(records: HabitRecordResponse[]): DayOfWeek | null {
    
    const relapses = getAllRelapsesOrdered(records);
    
    if (relapses.length === 0) return null;

    const dayCount: Record<number, number> = {};
    
    relapses.forEach(record => {
        const date = new Date(record.date_time);
        const dayOfWeek = date.getDay();
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
    // Usar função centralizada para garantir ordenação correta
    const relapses = getAllRelapsesOrdered(records);
    
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
 * Usa função centralizada para garantir ordenação cronológica correta
 */
export function getAverageIntervalBetweenRelapses(records: HabitRecordResponse[]): number | null {
    // Usar função centralizada que já ordena corretamente (ASC: mais antiga primeiro)
    const relapses = getAllRelapsesOrdered(records);

    if (relapses.length < 2) return null;

    const intervals: number[] = [];
    
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
        intervals.push(diffDays);
    }

    if (intervals.length === 0) return null;

    const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return Math.round(average * 10) / 10; // Arredondar para 1 casa decimal
}

/**
 * Identifica gatilhos recorrentes a partir dos campos note e title
 * Retorna até 3 termos mais frequentes
 */
export function getFrequentTriggers(records: HabitRecordResponse[], limit: number = 3): string[] {
    // Usar função centralizada para garantir ordenação correta
    const relapses = getAllRelapsesOrdered(records);
    
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
    // Usar função centralizada para garantir ordenação correta
    const relapses = getAllRelapsesOrdered(records);
    
    if (relapses.length === 0) {
        return { score: 0, level: 'Baixo' };
    }

    let riskScore = 0;

    // 1. Frequência de recaídas dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRelapses = relapses.filter(r => {
        const date = new Date(r.date_time);
        return date >= thirtyDaysAgo;
    }).length;

    // Máximo 40 pontos por frequência (mais de 5 recaídas = 40 pontos)
    riskScore += Math.min(recentRelapses * 8, 40);

    // 2. Proximidade da última recaída, quanto mais recente, maior o risco
    // Usar função centralizada para garantir que pegamos a recaída mais recente
    const lastRelapseRecord = getLastRelapse(records);

    if (lastRelapseRecord) {
        const lastRelapseTime = new Date(lastRelapseRecord.date_time).getTime();
        const daysSinceLastRelapse = (Date.now() - lastRelapseTime) / (1000 * 60 * 60 * 24);
        
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
 * Gera insights combinados a partir dos gatilhos semânticos
 * Identifica padrões de combinação usando linguagem genérica e reflexiva
 * (não específica para álcool ou qualquer hábito)
 */
function generateCombinedInsights(triggers: Trigger[]): CombinedInsight[] {
    const insights: CombinedInsight[] = [];
    
    if (triggers.length < 2) return insights;
    
    // Agrupar gatilhos por tipo
    const byType: Record<string, Trigger[]> = {};
    triggers.forEach(trigger => {
        if (!byType[trigger.type]) {
            byType[trigger.type] = [];
        }
        byType[trigger.type].push(trigger);
    });
    
    // Gerar insights para combinações relevantes
    const types = Object.keys(byType);
    
    // Temporal + Emocional (combinação mais crítica)
    if (types.includes('temporal') && types.includes('emocional')) {
        const temporal = byType['temporal'][0];
        const emocional = byType['emocional'][0];
        // Canonizar labels antes de usar nos insights
        const temporalLabel = canonicalizeTrigger(temporal.label) || temporal.label;
        const emocionalLabel = canonicalizeTrigger(emocional.label) || emocional.label;
        insights.push({
            text: `${temporalLabel} associado a ${emocionalLabel} tende a aumentar decisões impulsivas. Este período requer atenção especial.`,
            triggers: [
                { label: temporalLabel, type: temporal.type },
                { label: emocionalLabel, type: emocional.type }
            ]
        });
    }
    
    // Social + Comportamental (contexto social de risco)
    if (types.includes('social') && types.includes('comportamental')) {
        const social = byType['social'][0];
        const comportamental = byType['comportamental'][0];
        const socialLabel = canonicalizeTrigger(social.label) || social.label;
        const comportamentalLabel = canonicalizeTrigger(comportamental.label) || comportamental.label;
        insights.push({
            text: `Ambientes sociais combinados com ${comportamentalLabel} aumentam o risco. Prepare alternativas para esses contextos.`,
            triggers: [
                { label: socialLabel, type: social.type },
                { label: comportamentalLabel, type: comportamental.type }
            ]
        });
    }
    
    // Contextual + Emocional (ambiente de vulnerabilidade)
    if (types.includes('contextual') && types.includes('emocional')) {
        const contextual = byType['contextual'][0];
        const emocional = byType['emocional'][0];
        const contextualLabel = canonicalizeTrigger(contextual.label) || contextual.label;
        const emocionalLabel = canonicalizeTrigger(emocional.label) || emocional.label;
        insights.push({
            text: `No contexto de ${contextualLabel}, ${emocionalLabel} emerge como gatilho frequente. Fique atento a essa combinação.`,
            triggers: [
                { label: contextualLabel, type: contextual.type },
                { label: emocionalLabel, type: emocional.type }
            ]
        });
    }
    
    // Temporal + Social (padrão recorrente)
    if (types.includes('temporal') && types.includes('social')) {
        const temporal = byType['temporal'][0];
        const social = byType['social'][0];
        const temporalLabel = canonicalizeTrigger(temporal.label) || temporal.label;
        const socialLabel = canonicalizeTrigger(social.label) || social.label;
        insights.push({
            text: `${temporalLabel} com ${socialLabel} forma um padrão recorrente. Antecipe essas situações com estratégias preventivas.`,
            triggers: [
                { label: temporalLabel, type: temporal.type },
                { label: socialLabel, type: social.type }
            ]
        });
    }
    
    // Temporal + Comportamental (momento de ação)
    if (types.includes('temporal') && types.includes('comportamental')) {
        const temporal = byType['temporal'][0];
        const comportamental = byType['comportamental'][0];
        const temporalLabel = canonicalizeTrigger(temporal.label) || temporal.label;
        const comportamentalLabel = canonicalizeTrigger(comportamental.label) || comportamental.label;
        insights.push({
            text: `${temporalLabel} é um momento frequente para o comportamento. Estabeleça rotinas alternativas neste período.`,
            triggers: [
                { label: temporalLabel, type: temporal.type },
                { label: comportamentalLabel, type: comportamental.type }
            ]
        });
    }
    
    // Emocional + Comportamental (estado emocional crítico)
    if (types.includes('emocional') && types.includes('comportamental')) {
        const emocional = byType['emocional'][0];
        const comportamental = byType['comportamental'][0];
        const emocionalLabel = canonicalizeTrigger(emocional.label) || emocional.label;
        const comportamentalLabel = canonicalizeTrigger(comportamental.label) || comportamental.label;
        insights.push({
            text: `${emocionalLabel} frequentemente precede o comportamento. Desenvolva estratégias para gerenciar esse estado emocional.`,
            triggers: [
                { label: emocionalLabel, type: emocional.type },
                { label: comportamentalLabel, type: comportamental.type }
            ]
        });
    }
    
    return insights;
}

/**
 * Função principal que realiza toda a análise da jornada
 * Agora com insights combinados baseados no dicionário semântico
 */
export function analyzeJourney(records: HabitRecordResponse[]): JourneyAnalysis {
    const { score, level } = calculateRiskScore(records);
    
    // Usar novo algoritmo semântico para gatilhos
    const semanticTriggers = extractSemanticTriggers(records, 6);
    
    // Gerar insights combinados a partir dos gatilhos
    const combinedInsights = semanticTriggers.length >= 2 
        ? generateCombinedInsights(semanticTriggers)
        : [];
    
    // Gerar sugestão contextual baseada no estado atual
    const contextualSuggestion = generateContextualSuggestion({
        triggers: semanticTriggers,
        riskLevel: level,
        dominantPeriod: getMostCriticalPeriod(records) || undefined
    });
    
    // Manter compatibilidade com versão antiga (apenas labels)
    const frequentTriggers = semanticTriggers.length > 0
        ? semanticTriggers.slice(0, 3).map(t => t.label)
        : getFrequentTriggers(records, 3);
    
    return {
        riskScore: score,
        riskLevel: level,
        mostRelapseDay: getMostRelapseDay(records),
        mostCriticalPeriod: getMostCriticalPeriod(records),
        averageIntervalBetweenRelapses: getAverageIntervalBetweenRelapses(records),
        frequentTriggers, // Compatibilidade
        semanticTriggers, // Novos gatilhos semânticos
        combinedInsights, // Insights combinados
        contextualSuggestion, // Sugestão contextual
    };
}

