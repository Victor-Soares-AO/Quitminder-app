/**
 * HUB EDUCATIVO
 * 
 * Estrutura de conteúdos educativos organizados por INTENÇÃO,
 * não por formato. Neutro, informativo, sem recomendações personalizadas.
 * 
 * Regras:
 * - Linguagem informativa, não moral
 * - Nenhuma recomendação personalizada
 * - Apenas curadoria leve
 */

export type EducationalContent = {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'book' | 'video' | 'article' | 'podcast';
    url?: string;
    author?: string;
    duration?: string;
};

export type EducationalCategory = {
    id: string;
    label: string;
    description: string;
    intention: string;
    contents: EducationalContent[];
};

export const EDUCATIONAL_HUB: EducationalCategory[] = [
    {
        id: 'emotional-triggers',
        label: 'Entender Gatilhos Emocionais',
        description: 'Conteúdos sobre como emoções influenciam decisões e comportamentos',
        intention: 'Ajudar a identificar e compreender a relação entre estados emocionais e padrões comportamentais',
        contents: [
            {
                id: 'emotional-brain',
                title: 'O Cérebro Emocional',
                description: 'Como as emoções influenciam nossas decisões e comportamentos',
                category: 'emotional-triggers',
                type: 'book',
                author: 'Daniel Goleman',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'emotional-regulation',
                title: 'Regulação Emocional',
                description: 'Técnicas práticas para gerenciar estados emocionais',
                category: 'emotional-triggers',
                type: 'video',
                duration: '15 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'triggers-awareness',
                title: 'Consciência de Gatilhos',
                description: 'Como identificar padrões emocionais que precedem comportamentos',
                category: 'emotional-triggers',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    },
    {
        id: 'impulsivity',
        label: 'Lidar com Impulsividade',
        description: 'Estratégias para aumentar pausa entre impulso e ação',
        intention: 'Desenvolver habilidades para criar espaço entre o impulso e a decisão',
        contents: [
            {
                id: 'pause-technique',
                title: 'A Técnica da Pausa',
                description: 'Como criar espaço entre impulso e ação',
                category: 'impulsivity',
                type: 'video',
                duration: '10 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'willpower',
                title: 'Força de Vontade',
                description: 'Entendendo os limites e estratégias do autocontrole',
                category: 'impulsivity',
                type: 'book',
                author: 'Roy Baumeister',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'mindfulness-impulse',
                title: 'Mindfulness e Impulsos',
                description: 'Como a atenção plena pode ajudar a observar impulsos sem agir',
                category: 'impulsivity',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    },
    {
        id: 'support-routines',
        label: 'Criar Rotinas de Suporte',
        description: 'Como estruturar hábitos que fortalecem o autocontrole',
        intention: 'Construir rotinas que oferecem estrutura e reduzem exposição a gatilhos',
        contents: [
            {
                id: 'atomic-habits',
                title: 'Hábitos Atômicos',
                description: 'Como construir pequenos hábitos que geram grandes mudanças',
                category: 'support-routines',
                type: 'book',
                author: 'James Clear',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'morning-routine',
                title: 'Rotinas Matinais',
                description: 'Como estruturar manhãs que fortalecem o dia',
                category: 'support-routines',
                type: 'video',
                duration: '12 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'habit-stacking',
                title: 'Empilhamento de Hábitos',
                description: 'Técnica para ancorar novos hábitos em rotinas existentes',
                category: 'support-routines',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    },
    {
        id: 'self-control',
        label: 'Fortalecer Autocontrole',
        description: 'Estratégias baseadas em evidências para aumentar resiliência',
        intention: 'Desenvolver capacidade de manter decisões alinhadas com objetivos de longo prazo',
        contents: [
            {
                id: 'self-control-science',
                title: 'A Ciência do Autocontrole',
                description: 'O que a pesquisa diz sobre força de vontade e resiliência',
                category: 'self-control',
                type: 'book',
                author: 'Kelly McGonigal',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'resilience-training',
                title: 'Treinamento de Resiliência',
                description: 'Exercícios práticos para fortalecer autocontrole',
                category: 'self-control',
                type: 'video',
                duration: '20 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'delayed-gratification',
                title: 'Gratificação Adiada',
                description: 'Como desenvolver capacidade de adiar recompensas imediatas',
                category: 'self-control',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    },
    {
        id: 'social-context',
        label: 'Contextos Sociais',
        description: 'Como ambientes e relacionamentos influenciam comportamentos',
        intention: 'Entender e navegar pressões sociais e ambientes que aumentam exposição',
        contents: [
            {
                id: 'social-influence',
                title: 'Influência Social',
                description: 'Como grupos e ambientes moldam nossas decisões',
                category: 'social-context',
                type: 'book',
                author: 'Robert Cialdini',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'boundaries',
                title: 'Estabelecer Limites',
                description: 'Como comunicar e manter limites em contextos sociais',
                category: 'social-context',
                type: 'video',
                duration: '18 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'peer-pressure',
                title: 'Pressão de Pares',
                description: 'Estratégias para navegar pressão social sem comprometer objetivos',
                category: 'social-context',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    },
    {
        id: 'stress-management',
        label: 'Gerenciamento de Estresse',
        description: 'Técnicas para reduzir impacto do estresse em decisões',
        intention: 'Desenvolver habilidades para gerenciar estresse de forma construtiva',
        contents: [
            {
                id: 'stress-response',
                title: 'Resposta ao Estresse',
                description: 'Como o corpo e mente reagem ao estresse',
                category: 'stress-management',
                type: 'book',
                author: 'Robert Sapolsky',
                url: 'https://www.amazon.com.br'
            },
            {
                id: 'breathing-techniques',
                title: 'Técnicas de Respiração',
                description: 'Exercícios práticos para reduzir estresse rapidamente',
                category: 'stress-management',
                type: 'video',
                duration: '8 min',
                url: 'https://www.youtube.com'
            },
            {
                id: 'stress-habits',
                title: 'Estresse e Hábitos',
                description: 'Como o estresse afeta padrões comportamentais',
                category: 'stress-management',
                type: 'article',
                url: 'https://www.example.com'
            }
        ]
    }
];

/**
 * Busca conteúdos por categoria
 */
export function getContentByCategory(categoryId: string): EducationalCategory | undefined {
    return EDUCATIONAL_HUB.find(cat => cat.id === categoryId);
}

/**
 * Busca todos os conteúdos
 */
export function getAllEducationalContent(): EducationalContent[] {
    return EDUCATIONAL_HUB.flatMap(category => category.contents);
}

/**
 * Busca categorias relacionadas a um tipo de gatilho
 */
export function getCategoriesByTriggerType(triggerType: string): EducationalCategory[] {
    const mapping: Record<string, string[]> = {
        'emocional': ['emotional-triggers', 'stress-management'],
        'social': ['social-context'],
        'comportamental': ['impulsivity', 'self-control'],
        'temporal': ['support-routines'],
        'contextual': ['social-context', 'support-routines']
    };
    
    const categoryIds = mapping[triggerType] || [];
    return EDUCATIONAL_HUB.filter(cat => categoryIds.includes(cat.id));
}

