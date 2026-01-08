/**
 * CANONIZAÇÃO SEMÂNTICA DE GATILHOS
 * 
 * Converte termos literais, fragmentos textuais e variações linguísticas
 * em CONCEITOS CANÔNICOS estáveis e humanos.
 * 
 * Objetivo: Evitar que fragmentos como "Cansado e decidi" ou "Sem forças e"
 * apareçam na UI, substituindo por conceitos psicológicos claros.
 */

/**
 * Mapa de canonização: fragmentos textuais → conceitos canônicos
 * Organizado por categoria semântica para facilitar manutenção
 */
const CANONICAL_MAP: Record<string, string> = {
    // Cansaço / Exaustão
    'cansado': 'Cansaço',
    'cansada': 'Cansaço',
    'cansados': 'Cansaço',
    'cansadas': 'Cansaço',
    'exausto': 'Cansaço',
    'exausta': 'Cansaço',
    'exaustos': 'Cansaço',
    'exaustas': 'Cansaço',
    'sem forças': 'Cansaço',
    'sem força': 'Cansaço',
    'sem energias': 'Cansaço',
    'sem energia': 'Cansaço',
    'muito cansado': 'Cansaço',
    'muito cansada': 'Cansaço',
    'cansado e': 'Cansaço',
    'cansada e': 'Cansaço',
    
    // Impulsividade / Decisão
    'decidi': 'Impulsividade',
    'decidiu': 'Impulsividade',
    'decidimos': 'Impulsividade',
    'decidir': 'Impulsividade',
    'cedi': 'Impulsividade',
    'cedeu': 'Impulsividade',
    'ceder': 'Impulsividade',
    'acabei': 'Impulsividade',
    'acabou': 'Impulsividade',
    'acabar': 'Impulsividade',
    'não resisti': 'Impulsividade',
    'não resistiu': 'Impulsividade',
    'não resistir': 'Impulsividade',
    'não consegui': 'Impulsividade',
    'não conseguiu': 'Impulsividade',
    'não conseguiram': 'Impulsividade',
    'não aguentei': 'Impulsividade',
    'não aguentou': 'Impulsividade',
    'impulso': 'Impulsividade',
    'impulsivo': 'Impulsividade',
    'impulsiva': 'Impulsividade',
    'e decidi': 'Impulsividade',
    'e cedi': 'Impulsividade',
    'e acabei': 'Impulsividade',
    
    // Solidão / Isolamento
    'sozinho': 'Solidão',
    'sozinha': 'Solidão',
    'sozinhos': 'Solidão',
    'sozinhas': 'Solidão',
    'isolado': 'Solidão',
    'isolada': 'Solidão',
    'isolados': 'Solidão',
    'isoladas': 'Solidão',
    'solitário': 'Solidão',
    'solitária': 'Solidão',
    'solitários': 'Solidão',
    'solitárias': 'Solidão',
    'sozinho em': 'Solidão',
    'sozinha em': 'Solidão',
    'sozinho em casa': 'Solidão',
    'sozinha em casa': 'Solidão',
    
    // Pressão Social
    'pressão': 'Pressão Social',
    'pressao': 'Pressão Social',
    'pressionado': 'Pressão Social',
    'pressionada': 'Pressão Social',
    'pressionados': 'Pressão Social',
    'pressionadas': 'Pressão Social',
    'me forçaram': 'Pressão Social',
    'me forçou': 'Pressão Social',
    'forçado': 'Pressão Social',
    'forcado': 'Pressão Social',
    'forçada': 'Pressão Social',
    'forcada': 'Pressão Social',
    'obrigado': 'Pressão Social',
    'obrigada': 'Pressão Social',
    'obrigados': 'Pressão Social',
    'obrigadas': 'Pressão Social',
    'insistência': 'Pressão Social',
    'insistencia': 'Pressão Social',
    'insistiram': 'Pressão Social',
    'insistiu': 'Pressão Social',
    'me pressionaram': 'Pressão Social',
    'me pressionou': 'Pressão Social',
    
    // Tédio / Vazio
    'tédio': 'Tédio',
    'tedio': 'Tédio',
    'entediado': 'Tédio',
    'entediada': 'Tédio',
    'entediados': 'Tédio',
    'entediadas': 'Tédio',
    'sem nada pra fazer': 'Tédio',
    'sem nada para fazer': 'Tédio',
    'sem fazer nada': 'Tédio',
    'ocioso': 'Tédio',
    'ociosa': 'Tédio',
    'ociosos': 'Tédio',
    'ociosas': 'Tédio',
    'vazio': 'Tédio',
    'vazia': 'Tédio',
    'vazios': 'Tédio',
    'vazias': 'Tédio',
    
    // Raiva / Irritação
    'raiva': 'Raiva',
    'irritado': 'Raiva',
    'irritada': 'Raiva',
    'irritados': 'Raiva',
    'irritadas': 'Raiva',
    'irritação': 'Raiva',
    'irritacao': 'Raiva',
    'bravo': 'Raiva',
    'brava': 'Brava',
    'bravos': 'Raiva',
    'bravas': 'Raiva',
    'revoltado': 'Raiva',
    'revoltada': 'Raiva',
    'revoltados': 'Raiva',
    'revoltadas': 'Raiva',
    
    // Culpa / Remorso
    'culpa': 'Culpa',
    'culpado': 'Culpa',
    'culpada': 'Culpa',
    'culpados': 'Culpa',
    'culpadas': 'Culpa',
    'remorso': 'Culpa',
    'arrependido': 'Culpa',
    'arrependida': 'Culpa',
    'arrependidos': 'Culpa',
    'arrependidas': 'Culpa',
    'me sinto mal': 'Culpa',
    'me sinto culpado': 'Culpa',
    'me sinto culpada': 'Culpa',
    
    // Fragmentos comuns que devem ser filtrados
    'e decidi': 'Impulsividade',
    'e cedi': 'Impulsividade',
    'e acabei': 'Impulsividade',
    'e não': '', // Filtrar fragmentos incompletos
    'sem forças e': 'Cansaço',
    'cansado e': 'Cansaço',
    'cansada e': 'Cansaço',
};

/**
 * Lista de fragmentos que devem ser completamente removidos
 * (não têm conceito canônico válido)
 */
const INVALID_FRAGMENTS = new Set([
    'e',
    'e não',
    'e decidi',
    'e cedi',
    'e acabei',
    'sem forças e',
    'sem força e',
    'e sem',
    'e quando',
    'e depois',
    'e antes',
]);

/**
 * Canoniza um label de gatilho para um conceito canônico
 * 
 * @param label - Label bruto extraído do texto
 * @returns Conceito canônico ou null se for fragmento inválido
 */
export function canonicalizeTrigger(label: string): string | null {
    if (!label || label.trim().length === 0) {
        return null;
    }
    
    const labelLower = label.toLowerCase().trim();
    
    // Verificar se é um fragmento inválido
    if (INVALID_FRAGMENTS.has(labelLower)) {
        return null;
    }
    
    // Buscar mapeamento direto
    if (CANONICAL_MAP[labelLower]) {
        const canonical = CANONICAL_MAP[labelLower];
        // Se mapear para string vazia, é inválido
        return canonical || null;
    }
    
    // Buscar mapeamento parcial (label contém ou é contido por um termo canônico)
    for (const [fragment, canonical] of Object.entries(CANONICAL_MAP)) {
        if (labelLower.includes(fragment) || fragment.includes(labelLower)) {
            if (canonical && canonical.length > 0) {
                return canonical;
            }
        }
    }
    
    // Se não encontrou mapeamento, verificar se é um fragmento incompleto
    // Fragmentos incompletos geralmente terminam com "e", "e não", etc.
    if (labelLower.endsWith(' e') || labelLower.endsWith(' e não') || labelLower.length < 4) {
        return null;
    }
    
    // Se passou todas as validações, retornar o label capitalizado
    // (pode ser um conceito válido que não está no mapa ainda)
    return capitalizeFirst(label);
}

/**
 * Canoniza múltiplos gatilhos, removendo duplicatas e inválidos
 */
export function canonicalizeTriggers(triggers: Array<{ label: string; type?: string; confidence?: number }>): Array<{ label: string; type?: string; confidence?: number }> {
    const canonicalMap = new Map<string, { label: string; type?: string; confidence: number }>();
    
    triggers.forEach(trigger => {
        const canonical = canonicalizeTrigger(trigger.label);
        
        if (!canonical) {
            return; // Ignorar fragmentos inválidos
        }
        
        // Agrupar por label canônico, mantendo maior confiança
        if (canonicalMap.has(canonical)) {
            const existing = canonicalMap.get(canonical)!;
            if (trigger.confidence && trigger.confidence > existing.confidence) {
                canonicalMap.set(canonical, {
                    label: canonical,
                    type: trigger.type || existing.type,
                    confidence: trigger.confidence
                });
            }
        } else {
            canonicalMap.set(canonical, {
                label: canonical,
                type: trigger.type,
                confidence: trigger.confidence || 0
            });
        }
    });
    
    return Array.from(canonicalMap.values());
}

/**
 * Capitaliza primeira letra mantendo acentos
 */
function capitalizeFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

