/**
 * DICIONÁRIO DE LEMAS E AGRUPAMENTOS SEMÂNTICOS
 * 
 * Base linguística para extração de gatilhos e geração de insights
 * na Análise da Jornada.
 * 
 * Foco: Comportamentos, emoções, contexto e rotina do usuário comum.
 * Linguagem: Português brasileiro coloquial.
 * Objetivo: Autoconsciência e reflexão, não análise clínica.
 */

export type SemanticCategory = "temporal" | "emocional" | "social" | "comportamental" | "contextual";

export type SemanticGroup = {
    label: string;              // Label humano e legível
    type: SemanticCategory;     // Categoria do agrupamento
    lemas: string[];            // Formas base (lemas) que pertencem a este grupo
    exemplos: string[];         // Exemplos reais de uso em frases
    peso?: number;              // Peso para cálculo de relevância (opcional)
};

/**
 * DICIONÁRIO PRINCIPAL DE AGRUPAMENTOS SEMÂNTICOS
 * 
 * Organizado por categoria para facilitar manutenção e expansão.
 */
export const SEMANTIC_DICTIONARY: Record<string, SemanticGroup> = {
    // ============================================
    // CATEGORIA: TEMPORAL
    // ============================================
    manha: {
        label: "Manhã",
        type: "temporal",
        lemas: ["manhã", "manha", "madrugada", "cedo", "amanhecer", "despertar", "acordar"],
        exemplos: [
            "bebi de manhã",
            "acordei e já fui direto",
            "cedo demais hoje"
        ],
        peso: 1.2
    },
    tarde: {
        label: "Tarde",
        type: "temporal",
        lemas: ["tarde", "almoço", "almoco", "pós-almoço", "pos-almoco", "após almoço", "depois do almoço"],
        exemplos: [
            "depois do almoço sempre acontece",
            "tarde de trabalho",
            "pós-almoço é difícil"
        ],
        peso: 1.1
    },
    noite: {
        label: "Noite",
        type: "temporal",
        lemas: ["noite", "noitinha", "fim do dia", "final do dia", "anoitecer", "escurecer"],
        exemplos: [
            "noite é sempre pior",
            "fim do dia e já desandou",
            "quando escurece fica difícil"
        ],
        peso: 1.3
    },
    fim_semana: {
        label: "Fim de Semana",
        type: "temporal",
        lemas: ["sábado", "sabado", "domingo", "fim de semana", "fim-de-semana", "final de semana", "weekend"],
        exemplos: [
            "sábado à noite sempre rola",
            "fim de semana é complicado",
            "domingo de manhã"
        ],
        peso: 1.4
    },
    depois_trabalho: {
        label: "Depois do Trabalho",
        type: "temporal",
        lemas: ["depois do trabalho", "após trabalho", "saída do trabalho", "saida do trabalho", "fim do expediente"],
        exemplos: [
            "depois do trabalho sempre bebo",
            "saída do trabalho é gatilho",
            "fim do expediente e já desandou"
        ],
        peso: 1.5
    },
    antes_dormir: {
        label: "Antes de Dormir",
        type: "temporal",
        lemas: ["antes de dormir", "antes de deitar", "hora de dormir", "na cama", "deitado"],
        exemplos: [
            "antes de dormir sempre acontece",
            "deitado na cama e já pensando",
            "hora de dormir é difícil"
        ],
        peso: 1.2
    },

    // ============================================
    // CATEGORIA: EMOCIONAL
    // ============================================
    ansiedade: {
        label: "Ansiedade",
        type: "emocional",
        lemas: ["ansiedade", "ansioso", "ansiosa", "ansiosos", "ansiosas", "angústia", "angustia", "nervoso", "nervosa", "nervosismo"],
        exemplos: [
            "estava muito ansioso",
            "ansiedade me pegou",
            "nervoso demais hoje"
        ],
        peso: 1.4
    },
    estresse: {
        label: "Estresse",
        type: "emocional",
        lemas: ["estresse", "stress", "tensão", "tensao", "pressão", "pressao", "sobrecarga", "sobrecarregado", "sobrecarregada"],
        exemplos: [
            "muito estresse no trabalho",
            "pressão demais hoje",
            "sobrecarregado de responsabilidades"
        ],
        peso: 1.5
    },
    tristeza: {
        label: "Tristeza",
        type: "emocional",
        lemas: ["triste", "tristeza", "melancolia", "deprimido", "deprimida", "depressão", "depressao", "baixo astral", "pra baixo"],
        exemplos: [
            "estava muito triste",
            "deprimido hoje",
            "baixo astral me pegou"
        ],
        peso: 1.4
    },
    raiva: {
        label: "Raiva",
        type: "emocional",
        lemas: ["raiva", "irritado", "irritada", "irritação", "irritacao", "bravo", "brava", "nervoso", "nervosa", "revoltado", "revoltada"],
        exemplos: [
            "muito irritado com a situação",
            "raiva me dominou",
            "bravo com tudo hoje"
        ],
        peso: 1.3
    },
    tédio: {
        label: "Tédio",
        type: "emocional",
        lemas: ["tédio", "tedio", "entediado", "entediada", "sem nada pra fazer", "ocioso", "ociosa", "vazio", "vazia"],
        exemplos: [
            "muito tédio hoje",
            "sem nada pra fazer e já desandou",
            "entediado em casa"
        ],
        peso: 1.2
    },
    solidão: {
        label: "Solidão",
        type: "emocional",
        lemas: ["solidão", "solidao", "sozinho", "sozinha", "solitário", "solitario", "isolado", "isolada", "sozinho em casa"],
        exemplos: [
            "sozinho em casa sempre acontece",
            "solidão bateu forte",
            "isolado e já pensando"
        ],
        peso: 1.3
    },
    culpa: {
        label: "Culpa",
        type: "emocional",
        lemas: ["culpa", "culpado", "culpada", "remorso", "arrependido", "arrependida", "me sinto mal"],
        exemplos: [
            "me sinto culpado",
            "muita culpa depois",
            "arrependido mas não consigo parar"
        ],
        peso: 1.1
    },

    // ============================================
    // CATEGORIA: SOCIAL
    // ============================================
    amigos: {
        label: "Amigos",
        type: "social",
        lemas: ["amigo", "amigos", "amiga", "amigas", "galera", "turma", "pessoas", "grupo", "parceiro", "parceira"],
        exemplos: [
            "com amigos sempre rola",
            "galera me chamou",
            "turma toda estava"
        ],
        peso: 1.4
    },
    familia: {
        label: "Família",
        type: "social",
        lemas: ["família", "familia", "pai", "mãe", "mae", "irmão", "irmao", "irmã", "irma", "parentes", "primos", "tios"],
        exemplos: [
            "reunião de família",
            "pai me pressionou",
            "com a família sempre acontece"
        ],
        peso: 1.3
    },
    trabalho_social: {
        label: "Colegas de Trabalho",
        type: "social",
        lemas: ["colega", "colegas", "chefe", "chefes", "equipe", "time", "pessoal do trabalho"],
        exemplos: [
            "happy hour com colegas",
            "chefe me estressou",
            "equipe toda foi"
        ],
        peso: 1.2
    },
    festa: {
        label: "Festa / Evento Social",
        type: "social",
        lemas: ["festa", "festas", "evento", "eventos", "aniversário", "aniversario", "casamento", "confraternização", "confraternizacao"],
        exemplos: [
            "festa de aniversário",
            "evento de trabalho",
            "casamento da família"
        ],
        peso: 1.5
    },
    pressao_social: {
        label: "Pressão Social",
        type: "social",
        lemas: ["pressão", "pressao", "pressionado", "pressionada", "obrigado", "obrigada", "forçado", "forcado", "forçada", "forcada", "insistência", "insistencia"],
        exemplos: [
            "pressionado a beber",
            "insistência dos amigos",
            "me forçaram"
        ],
        peso: 1.3
    },
    sozinho: {
        label: "Sozinho",
        type: "social",
        lemas: ["sozinho", "sozinha", "só", "so", "isolado", "isolada", "sem companhia"],
        exemplos: [
            "sozinho em casa",
            "só eu e meus pensamentos",
            "sem companhia hoje"
        ],
        peso: 1.2
    },

    // ============================================
    // CATEGORIA: COMPORTAMENTAL
    // ============================================
    alcool: {
        label: "Álcool",
        type: "comportamental",
        lemas: ["beber", "bebida", "bebidas", "álcool", "alcool", "cerveja", "cervejas", "vinho", "vinhos", "whisky", "vodka", "cachaça", "pinga", "drink", "drinks", "bebi", "bebeu", "bebendo"],
        exemplos: [
            "bebi depois do trabalho",
            "cerveja com amigos",
            "vinho no jantar"
        ],
        peso: 1.5
    },
    cigarro: {
        label: "Cigarro",
        type: "comportamental",
        lemas: ["cigarro", "cigarros", "fumar", "fumei", "fumou", "fumando", "tabaco", "nicotina", "maço", "maco"],
        exemplos: [
            "fumei um cigarro",
            "maço acabou e já comprei outro",
            "fumando muito hoje"
        ],
        peso: 1.4
    },
    redes_sociais: {
        label: "Redes Sociais",
        type: "comportamental",
        lemas: ["instagram", "facebook", "twitter", "tiktok", "whatsapp", "redes sociais", "celular", "telefone", "scrolling", "rolagem"],
        exemplos: [
            "passando muito tempo no instagram",
            "rolagem infinita no celular",
            "whatsapp me distraiu"
        ],
        peso: 1.2
    },
    comida: {
        label: "Comida / Alimentação",
        type: "comportamental",
        lemas: ["comer", "comida", "comidas", "lanche", "lanches", "junk food", "fast food", "doces", "doce", "chocolate", "pizza", "hambúrguer", "hamburguer"],
        exemplos: [
            "comi demais hoje",
            "junk food me pegou",
            "doces sempre me chamam"
        ],
        peso: 1.1
    },
    compras: {
        label: "Compras Compulsivas",
        type: "comportamental",
        lemas: ["comprar", "comprei", "compras", "shopping", "online", "amazon", "ifood", "delivery"],
        exemplos: [
            "comprei coisas que não precisava",
            "shopping online me pegou",
            "delivery demais hoje"
        ],
        peso: 1.1
    },
    procrastinação: {
        label: "Procrastinação",
        type: "comportamental",
        lemas: ["procrastinar", "procrastinação", "procrastinacao", "adiar", "deixar pra depois", "preguiça", "preguiçoso", "preguiçosa"],
        exemplos: [
            "procrastinei tudo hoje",
            "preguiça me dominou",
            "deixei tudo pra depois"
        ],
        peso: 1.0
    },

    // ============================================
    // CATEGORIA: CONTEXTUAL
    // ============================================
    casa: {
        label: "Casa",
        type: "contextual",
        lemas: ["casa", "em casa", "lar", "quarto", "sala", "cozinha", "banheiro", "sofá", "sofa", "cama"],
        exemplos: [
            "sozinho em casa",
            "no quarto sempre acontece",
            "sofá e já desandou"
        ],
        peso: 1.3
    },
    trabalho: {
        label: "Trabalho",
        type: "contextual",
        lemas: ["trabalho", "escritório", "escritorio", "empresa", "escritório", "escritorio", "reunião", "reuniao", "cliente", "projeto", "chefe", "chefes"],
        exemplos: [
            "estresse no trabalho",
            "reunião difícil",
            "chefe me pressionou"
        ],
        peso: 1.4
    },
    transporte: {
        label: "Transporte",
        type: "contextual",
        lemas: ["carro", "ônibus", "onibus", "metrô", "metro", "táxi", "taxi", "uber", "transporte", "trânsito", "transito", "no caminho"],
        exemplos: [
            "no trânsito sempre acontece",
            "ônibus lotado me estressou",
            "no caminho para casa"
        ],
        peso: 1.1
    },
    restaurante: {
        label: "Restaurante / Bar",
        type: "contextual",
        lemas: ["restaurante", "restaurantes", "bar", "bares", "lanchonete", "padaria", "café", "cafe", "balada", "baladas"],
        exemplos: [
            "bar com amigos",
            "restaurante sempre tem",
            "balada de sábado"
        ],
        peso: 1.3
    },
    academia: {
        label: "Academia / Exercício",
        type: "contextual",
        lemas: ["academia", "ginásio", "ginasio", "treino", "treinar", "exercício", "exercicio", "corrida", "caminhada"],
        exemplos: [
            "depois da academia",
            "treino me deixou cansado",
            "corrida matinal"
        ],
        peso: 1.0
    },
    descanso: {
        label: "Descanso / Lazer",
        type: "contextual",
        lemas: ["descanso", "folga", "férias", "ferias", "feriado", "feriados", "lazer", "tempo livre", "sem fazer nada"],
        exemplos: [
            "folga e já desandou",
            "férias sempre é difícil",
            "tempo livre me pega"
        ],
        peso: 1.2
    }
};

/**
 * LEMATIZAÇÃO EXPANDIDA
 * 
 * Mapeia formas flexionadas para suas formas base (lemas).
 * Preserva acentos e foca em termos comuns em notas de usuários.
 */
export const LEMMATIZATION_DICTIONARY: Record<string, string> = {
    // Verbos - Beber
    'bebendo': 'beber', 'bebi': 'beber', 'bebeu': 'beber', 'bebemos': 'beber', 'bebem': 'beber',
    'bebia': 'beber', 'bebiam': 'beber', 'beberia': 'beber', 'beberiam': 'beber',
    
    // Verbos - Fumar
    'fumando': 'fumar', 'fumei': 'fumar', 'fumou': 'fumar', 'fumamos': 'fumar', 'fumam': 'fumar',
    'fumava': 'fumar', 'fumavam': 'fumar', 'fumaria': 'fumar', 'fumariam': 'fumar',
    
    // Verbos - Comer
    'comendo': 'comer', 'comi': 'comer', 'comeu': 'comer', 'comemos': 'comer', 'comem': 'comer',
    'comia': 'comer', 'comiam': 'comer', 'comeria': 'comer', 'comeriam': 'comer',
    
    // Verbos - Sentir
    'sentindo': 'sentir', 'senti': 'sentir', 'sentiu': 'sentir', 'sentimos': 'sentir', 'sentem': 'sentir',
    'sentia': 'sentir', 'sentiam': 'sentir', 'sentiria': 'sentir', 'sentiriam': 'sentir',
    
    // Verbos - Pensar
    'pensando': 'pensar', 'pensei': 'pensar', 'pensou': 'pensar', 'pensamos': 'pensar', 'pensam': 'pensar',
    'pensava': 'pensar', 'pensavam': 'pensar', 'pensaria': 'pensar', 'pensariam': 'pensar',
    
    // Verbos - Chegar
    'chegando': 'chegar', 'cheguei': 'chegar', 'chegou': 'chegar', 'chegamos': 'chegar', 'chegam': 'chegar',
    
    // Verbos - Voltar
    'voltando': 'voltar', 'voltei': 'voltar', 'voltou': 'voltar', 'voltamos': 'voltar', 'voltam': 'voltar',
    
    // Verbos - Sair
    'saindo': 'sair', 'sai': 'sair', 'saiu': 'sair', 'saímos': 'sair', 'saem': 'sair',
    
    // Verbos - Comprar
    'comprando': 'comprar', 'comprei': 'comprar', 'comprou': 'comprar', 'compramos': 'comprar', 'compram': 'comprar',
    
    // Substantivos plurais
    'amigos': 'amigo', 'amigas': 'amiga',
    'bebidas': 'bebida', 'cervejas': 'cerveja', 'vinhos': 'vinho',
    'pessoas': 'pessoa', 'colegas': 'colega',
    'cigarros': 'cigarro', 'maços': 'maço',
    'festas': 'festa', 'eventos': 'evento',
    'comidas': 'comida', 'lanches': 'lanche', 'doces': 'doce',
    
    // Adjetivos - Normalização
    'nervoso': 'nervoso', 'nervosa': 'nervoso', 'nervosos': 'nervoso', 'nervosas': 'nervoso',
    'triste': 'triste', 'tristes': 'triste',
    'ansioso': 'ansioso', 'ansiosa': 'ansioso', 'ansiosos': 'ansioso', 'ansiosas': 'ansioso',
    'irritado': 'irritado', 'irritada': 'irritado', 'irritados': 'irritado', 'irritadas': 'irritado',
    'sozinho': 'sozinho', 'sozinha': 'sozinho', 'sozinhos': 'sozinho', 'sozinhas': 'sozinho',
    'isolado': 'isolado', 'isolada': 'isolado', 'isolados': 'isolado', 'isoladas': 'isolado',
    'pressionado': 'pressionado', 'pressionada': 'pressionado', 'pressionados': 'pressionado', 'pressionadas': 'pressionado',
};

/**
 * FUNÇÕES AUXILIARES PARA USO DO DICIONÁRIO
 */

/**
 * Busca um agrupamento semântico por lema
 */
export function findSemanticGroup(lema: string): SemanticGroup | null {
    const lemaLower = lema.toLowerCase();
    
    for (const group of Object.values(SEMANTIC_DICTIONARY)) {
        if (group.lemas.some(l => l === lemaLower || lemaLower.includes(l) || l.includes(lemaLower))) {
            return group;
        }
    }
    
    return null;
}

/**
 * Lematiza uma palavra usando o dicionário
 */
export function lemmatize(term: string): string {
    const termLower = term.toLowerCase();
    return LEMMATIZATION_DICTIONARY[termLower] || termLower;
}

/**
 * Gera insights combinados a partir de múltiplos gatilhos
 * 
 * Exemplo: "Manhã + Ansiedade = período crítico"
 */
export function generateCombinedInsight(triggers: Array<{ label: string; type: SemanticCategory }>): string | null {
    if (triggers.length < 2) return null;
    
    const types = triggers.map(t => t.type);
    const labels = triggers.map(t => t.label);
    
    // Padrões de combinação conhecidos
    if (types.includes('temporal') && types.includes('emocional')) {
        const temporal = triggers.find(t => t.type === 'temporal')?.label;
        const emocional = triggers.find(t => t.type === 'emocional')?.label;
        return `${temporal} combinado com ${emocional} parece ser um período crítico.`;
    }
    
    if (types.includes('social') && types.includes('comportamental')) {
        const social = triggers.find(t => t.type === 'social')?.label;
        const comportamental = triggers.find(t => t.type === 'comportamental')?.label;
        return `Situações com ${social} frequentemente envolvem ${comportamental}.`;
    }
    
    if (types.includes('contextual') && types.includes('emocional')) {
        const contextual = triggers.find(t => t.type === 'contextual')?.label;
        const emocional = triggers.find(t => t.type === 'emocional')?.label;
        return `No contexto de ${contextual}, ${emocional} parece ser um gatilho comum.`;
    }
    
    return null;
}

/**
 * Retorna todos os agrupamentos de uma categoria específica
 */
export function getGroupsByCategory(category: SemanticCategory): SemanticGroup[] {
    return Object.values(SEMANTIC_DICTIONARY).filter(group => group.type === category);
}

/**
 * Retorna estatísticas do dicionário
 */
export function getDictionaryStats() {
    const stats = {
        total: Object.keys(SEMANTIC_DICTIONARY).length,
        byCategory: {} as Record<SemanticCategory, number>,
        totalLemas: 0,
    };
    
    Object.values(SEMANTIC_DICTIONARY).forEach(group => {
        stats.byCategory[group.type] = (stats.byCategory[group.type] || 0) + 1;
        stats.totalLemas += group.lemas.length;
    });
    
    return stats;
}

