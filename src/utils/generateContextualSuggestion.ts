import { Trigger } from "./extractTriggers";
import { RiskLevel } from "./analyzeJourney";

/**
 * SUGESTÕES CONTEXTUAIS NA ANÁLISE DA JORNADA
 * 
 * Gera uma sugestão curta e contextual baseada no estado atual do usuário.
 * 
 * Regras de linguagem:
 * - Nunca usar tom prescritivo ("você deve", "faça isso")
 * - Usar linguagem optativa e reflexiva
 * - Evitar termos clínicos ou moralizantes
 * - Genérico para qualquer hábito (não assumir álcool/cigarro)
 */

type UserState = {
    triggers: Trigger[];
    riskLevel?: RiskLevel;
    dominantPeriod?: string;
};

type Suggestion = {
    text: string;
    category: string;
    relatedHubCategory?: string; // ID da categoria do hub relacionada
};

/**
 * Gera uma sugestão contextual baseada no estado atual
 * Retorna null se não houver padrão relevante suficiente
 */
export function generateContextualSuggestion(state: UserState): Suggestion | null {
    const { triggers, riskLevel, dominantPeriod } = state;
    
    if (!triggers || triggers.length === 0) {
        return null;
    }
    
    // Agrupar gatilhos por tipo
    const byType: Record<string, Trigger[]> = {};
    triggers.forEach(trigger => {
        if (!byType[trigger.type]) {
            byType[trigger.type] = [];
        }
        byType[trigger.type].push(trigger);
    });
    
    const types = Object.keys(byType);
    
    // 1. Temporal + Emocional (período crítico)
    if (types.includes('temporal') && types.includes('emocional')) {
        const temporal = byType['temporal'][0];
        const emocional = byType['emocional'][0];
        
        // Mapear emoções para sugestões específicas
        const emotionMap: Record<string, string> = {
            'Cansaço': 'Rotinas curtas ao acordar podem ajudar a atravessar esse período com mais clareza.',
            'Ansiedade': 'Técnicas de respiração ou uma caminhada breve podem reduzir a tensão nesse momento.',
            'Estresse': 'Pausas curtas e intencionais podem ajudar a restaurar o equilíbrio nesse período.',
            'Tristeza': 'Atividades leves e reconfortantes podem oferecer suporte durante esse momento.',
            'Tédio': 'Ter uma lista de atividades alternativas pode preencher esse espaço de forma construtiva.',
        };
        
        const suggestion = emotionMap[emocional.label] || 
            'Algumas pessoas se beneficiam de rotinas curtas nesse período para manter o foco.';
        
        return {
            text: `${temporal.label} associado a ${emocional.label} costuma reduzir autocontrole. ${suggestion}`,
            category: 'temporal-emocional',
            relatedHubCategory: 'emotional-triggers'
        };
    }
    
    // 2. Social + Comportamental (contexto social de risco)
    if (types.includes('social') && types.includes('comportamental')) {
        const social = byType['social'][0];
        const comportamental = byType['comportamental'][0];
        
        return {
            text: `Ambientes com ${social.label} tendem a aumentar exposição ao comportamento. Planejar limites antes de sair costuma reduzir decisões impulsivas.`,
            category: 'social-comportamental',
            relatedHubCategory: 'social-context'
        };
    }
    
    // 3. Contextual + Emocional (ambiente de vulnerabilidade)
    if (types.includes('contextual') && types.includes('emocional')) {
        const contextual = byType['contextual'][0];
        const emocional = byType['emocional'][0];
        
        return {
            text: `No contexto de ${contextual.label}, ${emocional.label} emerge como gatilho frequente. Identificar alternativas para esse ambiente pode ajudar a reduzir exposição.`,
            category: 'contextual-emocional',
            relatedHubCategory: 'emotional-triggers'
        };
    }
    
    // 4. Temporal + Social (padrão recorrente)
    if (types.includes('temporal') && types.includes('social')) {
        const temporal = byType['temporal'][0];
        const social = byType['social'][0];
        
        return {
            text: `${temporal.label} com ${social.label} forma um padrão recorrente. Antecipar essas situações com estratégias simples pode aumentar a sensação de controle.`,
            category: 'temporal-social',
            relatedHubCategory: 'social-context'
        };
    }
    
    // 5. Emocional + Comportamental (estado emocional crítico)
    if (types.includes('emocional') && types.includes('comportamental')) {
        const emocional = byType['emocional'][0];
        
        const emotionStrategies: Record<string, string> = {
            'Cansaço': 'Descanso adequado e pausas regulares podem ajudar a manter decisões mais conscientes.',
            'Ansiedade': 'Técnicas de grounding ou atividades que acalmam podem reduzir a urgência nesse estado.',
            'Estresse': 'Gerenciar o estresse através de exercícios leves ou conversas pode diminuir a impulsividade.',
            'Tristeza': 'Buscar apoio social ou atividades que trazem conforto pode ajudar a atravessar esse momento.',
            'Tédio': 'Ter uma lista de atividades alternativas pode preencher o tempo de forma mais construtiva.',
        };
        
        const strategy = emotionStrategies[emocional.label] || 
            'Algumas pessoas se beneficiam de estratégias para gerenciar esse estado emocional antes que ele leve a decisões impulsivas.';
        
        return {
            text: `${emocional.label} frequentemente precede o comportamento. ${strategy}`,
            category: 'emocional-comportamental',
            relatedHubCategory: 'impulsivity'
        };
    }
    
    // 6. Risco alto + múltiplos gatilhos
    if (riskLevel === 'Alto' && triggers.length >= 3) {
        return {
            text: 'Múltiplos gatilhos identificados simultaneamente. Considerar estratégias preventivas antes desses momentos pode aumentar a sensação de controle.',
            category: 'alto-risco',
            relatedHubCategory: 'self-control'
        };
    }
    
    // 7. Padrão temporal dominante
    if (types.includes('temporal') && dominantPeriod) {
        const temporal = byType['temporal'][0];
        
        return {
            text: `${temporal.label} é um período frequente para o comportamento. Estabelecer rotinas alternativas nesse momento pode ajudar a criar novos padrões.`,
            category: 'temporal-dominante',
            relatedHubCategory: 'support-routines'
        };
    }
    
    // 8. Qualquer gatilho comportamental isolado
    if (types.includes('comportamental') && triggers.length === 1) {
        const comportamental = byType['comportamental'][0];
        
        return {
            text: `${comportamental.label} aparece como padrão frequente. Explorar alternativas e estratégias preventivas pode ajudar a reduzir exposição.`,
            category: 'comportamental-isolado',
            relatedHubCategory: 'impulsivity'
        };
    }
    
    // 9. Qualquer gatilho social isolado
    if (types.includes('social') && triggers.length === 1) {
        const social = byType['social'][0];
        
        return {
            text: `${social.label} aparece como contexto frequente. Planejar limites e estratégias para esses ambientes pode aumentar a sensação de controle.`,
            category: 'social-isolado',
            relatedHubCategory: 'social-context'
        };
    }
    
    // 10. Qualquer gatilho contextual isolado
    if (types.includes('contextual') && triggers.length === 1) {
        const contextual = byType['contextual'][0];
        
        return {
            text: `O contexto de ${contextual.label} aparece frequentemente. Identificar alternativas para esse ambiente pode ajudar a reduzir exposição.`,
            category: 'contextual-isolado',
            relatedHubCategory: 'support-routines'
        };
    }
    
    // Se não houver padrão relevante suficiente, retornar null
    return null;
}

