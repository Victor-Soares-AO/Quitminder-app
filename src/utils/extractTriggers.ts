import { HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { SEMANTIC_DICTIONARY, LEMMATIZATION_DICTIONARY, findSemanticGroup, lemmatize as lemmatizeWord, SemanticCategory } from "./semanticDictionary";
import { canonicalizeTrigger, canonicalizeTriggers } from "./canonicalizeTriggers";
import { getAllRelapsesOrdered } from "./calculateLastRelapse";

export type TriggerType = "temporal" | "emocional" | "social" | "comportamental" | "contextual";

export type Trigger = {
    label: string;
    type: TriggerType;
    confidence: number;
};

/**
 * Algoritmo heurístico para extração de gatilhos semânticos de alta qualidade
 * a partir de notas textuais de recaídas.
 * 
 * ESTRATÉGIA:
 * 1. Tokenização preservando acentos
 * 2. Lematização básica (redução a formas base)
 * 3. Detecção de padrões linguísticos (depois de X, quando X, antes de X)
 * 4. Extração de bigramas/trigramas significativos
 * 5. Agrupamento semântico de termos relacionados
 * 6. Classificação por tipo (temporal, emocional, social, comportamental)
 * 7. Cálculo de confiança baseado em frequência e contexto
 */

// Stopwords PT-BR expandidas
const STOPWORDS = new Set([
    'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por', 'que',
    'se', 'não', 'mais', 'foi', 'são', 'como', 'mas', 'ou', 'ser', 'ter', 'estar',
    'foi', 'tem', 'era', 'foram', 'pode', 'quando', 'onde', 'porque', 'então',
    'isso', 'aqui', 'ali', 'lá', 'meu', 'minha', 'meus', 'minhas', 'nosso',
    'nossa', 'você', 'ele', 'ela', 'eles', 'elas', 'eu', 'nós', 'vocês',
    'foi', 'fui', 'fora', 'sou', 'estou', 'estava', 'estive', 'estiver',
    'tenho', 'tinha', 'tive', 'ter', 'tiver', 'sendo', 'tendo', 'feito',
    'dito', 'visto', 'ido', 'vindo', 'sido', 'estado', 'tido', 'havia',
    'há', 'houve', 'terá', 'será', 'estará', 'teria', 'seria', 'estaria',
    'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
    'aquele', 'aquela', 'aqueles', 'aquelas', 'muito', 'muita', 'muitos', 'muitas',
    'pouco', 'pouca', 'poucos', 'poucas', 'todo', 'toda', 'todos', 'todas',
    'outro', 'outra', 'outros', 'outras', 'algum', 'alguma', 'alguns', 'algumas',
    'qualquer', 'quaisquer', 'cada', 'ambos', 'ambas', 'nenhum', 'nenhuma',
    'também', 'tampouco', 'já', 'ainda', 'sempre', 'nunca', 'jamais',
    'hoje', 'ontem', 'amanhã', 'agora', 'depois', 'antes', 'durante',
    'até', 'desde', 'entre', 'sobre', 'sob', 'sem', 'contra', 'perante',
    'mediante', 'conforme', 'segundo', 'consoante', 'através', 'através',
    'acima', 'abaixo', 'adiante', 'atrás', 'aqui', 'ali', 'lá', 'aí',
    'onde', 'aonde', 'donde', 'adonde', 'quando', 'quanto', 'quanta',
    'quantos', 'quantas', 'como', 'quão', 'porque', 'porquê', 'por que',
    'por quê', 'pois', 'porquanto', 'quanto', 'quanta', 'quantos', 'quantas'
]);

// Padrões linguísticos para detecção de gatilhos contextuais
const PATTERNS = [
    { regex: /(?:depois|após|pós)\s+(?:de\s+)?([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'comportamental' as TriggerType },
    { regex: /(?:antes|ante)\s+(?:de\s+)?([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'comportamental' as TriggerType },
    { regex: /(?:quando|enquanto|durante)\s+([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'temporal' as TriggerType },
    { regex: /(?:com|junto\s+com|na\s+companhia\s+de)\s+([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'social' as TriggerType },
    { regex: /(?:sentindo|senti|sinto)\s+([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'emocional' as TriggerType },
    { regex: /(?:estava|estou|estive)\s+([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+){0,2})/gi, type: 'emocional' as TriggerType },
];

// Usar dicionário semântico expandido de semanticDictionary.ts

/**
 * Normaliza texto preservando acentos
 */
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' '); // Normaliza espaços múltiplos
}

/**
 * Tokeniza texto preservando acentos
 */
function tokenize(text: string): string[] {
    return text
        .replace(/[^\w\sáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/g, ' ') // Remove pontuação, mantém acentos
        .split(/\s+/)
        .filter(token => token.length > 0);
}

/**
 * Lematiza uma palavra (reduz a forma base)
 * Usa o dicionário expandido de semanticDictionary.ts
 */
function lemmatize(word: string): string {
    return lemmatizeWord(word);
}

/**
 * Extrai bigramas e trigramas significativos
 */
function extractNgrams(tokens: string[], minLength: number = 2, maxLength: number = 3): string[] {
    const ngrams: string[] = [];
    
    for (let n = minLength; n <= maxLength && n <= tokens.length; n++) {
        for (let i = 0; i <= tokens.length - n; i++) {
            const ngram = tokens.slice(i, i + n).join(' ');
            // Filtrar ngrams que começam ou terminam com stopwords
            const firstWord = tokens[i];
            const lastWord = tokens[i + n - 1];
            if (!STOPWORDS.has(firstWord) && !STOPWORDS.has(lastWord)) {
                ngrams.push(ngram);
            }
        }
    }
    
    return ngrams;
}

/**
 * Detecta padrões linguísticos e extrai gatilhos contextuais
 */
function extractPatternTriggers(text: string): Array<{ label: string; type: TriggerType }> {
    const triggers: Array<{ label: string; type: TriggerType }> = [];
    
    PATTERNS.forEach(pattern => {
        const matches = [...text.matchAll(pattern.regex)];
        matches.forEach(match => {
            if (match[1]) {
                const label = match[1].trim();
                // Validar que não é apenas stopwords
                const words = label.split(/\s+/);
                const hasContent = words.some(w => !STOPWORDS.has(w) && w.length > 2);
                if (hasContent) {
                    triggers.push({ label, type: pattern.type });
                }
            }
        });
    });
    
    return triggers;
}

/**
 * Agrupa termos semanticamente relacionados
 * Usa o dicionário expandido de semanticDictionary.ts
 */
function groupSemanticTerms(term: string): { label: string; type: TriggerType } | null {
    const group = findSemanticGroup(term);
    if (group) {
        return { label: group.label, type: group.type as TriggerType };
    }
    return null;
}

/**
 * Classifica um termo por tipo baseado no dicionário semântico
 * Se não encontrar no dicionário, usa heurísticas básicas
 */
function classifyTerm(term: string): TriggerType {
    // Primeiro tenta encontrar no dicionário
    const group = findSemanticGroup(term);
    if (group) {
        return group.type as TriggerType;
    }
    
    // Fallback: heurísticas básicas se não encontrar no dicionário
    const termLower = term.toLowerCase();
    
    // Temporal
    if (/\b(manhã|manha|tarde|noite|madrugada|amanhã|amanha|hoje|ontem|sábado|sabado|domingo|segunda|terça|quarta|quinta|sexta|fim de semana|fim-de-semana)\b/.test(termLower)) {
        return 'temporal';
    }
    
    // Emocional
    if (/\b(triste|ansioso|ansiosa|nervoso|nervosa|estresse|stress|depressão|depressao|raiva|medo|angústia|angustia|feliz|alegre)\b/.test(termLower)) {
        return 'emocional';
    }
    
    // Social
    if (/\b(amigo|amiga|família|familia|pai|mãe|mae|irmão|irmao|chefe|colega|pessoas|grupo|turma)\b/.test(termLower)) {
        return 'social';
    }
    
    // Contextual
    if (/\b(casa|trabalho|escritório|escritorio|carro|ônibus|onibus|restaurante|bar|academia|ginásio|ginasio)\b/.test(termLower)) {
        return 'contextual';
    }
    
    // Comportamental (padrão)
    return 'comportamental';
}

/**
 * Capitaliza primeira letra mantendo acentos
 */
function capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Extrai gatilhos semânticos de alta qualidade a partir de registros
 */
export function extractSemanticTriggers(
    records: HabitRecordResponse[],
    limit: number = 6
): Trigger[] {
    // Usar função centralizada para garantir consistência
    // (não precisa de ordenação aqui, mas mantém padrão)
    const relapses = getAllRelapsesOrdered(records);
    
    if (relapses.length === 0) return [];

    // Contadores para diferentes tipos de gatilhos
    const triggerCounts: Map<string, { count: number; type: TriggerType; contexts: Set<string> }> = new Map();
    
    relapses.forEach(record => {
        const text = normalizeText(`${record.title || ''} ${record.note || ''}`);
        if (!text || text.trim().length === 0) return;
        
        // 1. Extrair padrões linguísticos
        const patternTriggers = extractPatternTriggers(text);
        patternTriggers.forEach(({ label, type }) => {
            const key = label.toLowerCase();
            if (!triggerCounts.has(key)) {
                triggerCounts.set(key, { count: 0, type, contexts: new Set() });
            }
            const entry = triggerCounts.get(key)!;
            entry.count += 2; // Padrões têm peso maior
            entry.contexts.add(text.substring(0, 50)); // Guarda contexto para validação
        });
        
        // 2. Tokenizar e processar palavras
        const tokens = tokenize(text)
            .map(lemmatize)
            .filter(token => token.length > 2 && !STOPWORDS.has(token));
        
        // 3. Extrair ngrams (bigramas e trigramas)
        const ngrams = extractNgrams(tokens, 2, 3);
        ngrams.forEach(ngram => {
            const key = ngram.toLowerCase();
            if (!triggerCounts.has(key)) {
                const semanticGroup = groupSemanticTerms(ngram);
                const type = semanticGroup ? semanticGroup.type : classifyTerm(ngram);
                triggerCounts.set(key, { count: 0, type, contexts: new Set() });
            }
            triggerCounts.get(key)!.count += 1.5; // Ngrams têm peso médio
        });
        
        // 4. Processar palavras individuais significativas
        tokens.forEach(token => {
            if (token.length > 3) { // Apenas palavras com mais de 3 caracteres
                const semanticGroup = groupSemanticTerms(token);
                if (semanticGroup) {
                    // Se pertence a um grupo semântico, usar o label do grupo
                    const key = semanticGroup.label.toLowerCase();
                    if (!triggerCounts.has(key)) {
                        triggerCounts.set(key, { count: 0, type: semanticGroup.type, contexts: new Set() });
                    }
                    // Usar peso do dicionário se disponível, senão padrão 1.0
                    const group = findSemanticGroup(token);
                    const weight = group?.peso || 1.0;
                    triggerCounts.get(key)!.count += 1 * weight;
                } else {
                    // Palavra individual
                    const key = token.toLowerCase();
                    if (!triggerCounts.has(key)) {
                        triggerCounts.set(key, { count: 0, type: classifyTerm(token), contexts: new Set() });
                    }
                    triggerCounts.get(key)!.count += 0.5; // Palavras isoladas têm peso menor
                }
            }
        });
    });
    
    // 5. Converter para array e calcular confiança
    const rawTriggers: Trigger[] = Array.from(triggerCounts.entries())
        .map(([label, data]) => {
            // Calcular confiança baseada em frequência e número de contextos únicos
            const frequencyScore = data.count / relapses.length;
            const contextScore = Math.min(data.contexts.size / relapses.length, 1);
            const confidence = Math.min((frequencyScore * 0.7 + contextScore * 0.3) * 100, 100);
            
            return {
                label: label, // Manter original para canonização
                type: data.type,
                confidence: Math.round(confidence * 100) / 100,
            };
        })
        .filter(trigger => trigger.confidence > 0.3); // Filtrar gatilhos com baixa confiança
    
    // 6. CANONIZAÇÃO: Converter labels brutos em conceitos canônicos
    const canonicalized = canonicalizeTriggers(rawTriggers)
        .sort((a, b) => b.confidence - a.confidence) // Ordenar por confiança
        .slice(0, limit); // Limitar resultado
    
    return canonicalized as Trigger[];
}

