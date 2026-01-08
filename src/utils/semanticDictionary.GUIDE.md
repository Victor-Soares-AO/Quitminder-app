# Guia do Dicionário Semântico

## Visão Geral

O dicionário semântico é a base linguística para extração de gatilhos e geração de insights na Análise da Jornada. Ele agrupa termos relacionados sob conceitos humanos e legíveis.

## Estrutura do Dicionário

Cada agrupamento contém:
- **label**: Nome humano e legível (ex: "Álcool")
- **type**: Categoria (temporal, emocional, social, comportamental, contextual)
- **lemas**: Formas base que pertencem ao grupo (ex: ["beber", "cerveja", "vinho"])
- **exemplos**: Frases reais de uso (ex: ["bebi depois do trabalho"])
- **peso**: Opcional, para cálculo de relevância (padrão: 1.0)

## Como Expandir o Dicionário

### 1. Adicionar Novo Agrupamento

```typescript
export const SEMANTIC_DICTIONARY: Record<string, SemanticGroup> = {
    // ... agrupamentos existentes ...
    
    novo_grupo: {
        label: "Nome Legível",
        type: "categoria", // temporal | emocional | social | comportamental | contextual
        lemas: ["lema1", "lema2", "lema3"],
        exemplos: [
            "exemplo real de uso 1",
            "exemplo real de uso 2"
        ],
        peso: 1.2 // Opcional, padrão 1.0
    }
};
```

### 2. Adicionar Lematizações

```typescript
export const LEMMATIZATION_DICTIONARY: Record<string, string> = {
    // ... lematizações existentes ...
    
    'forma_flexionada': 'forma_base',
    'bebendo': 'beber',
    'fumando': 'fumar'
};
```

### 3. Critérios para Adicionar

- ✅ Termos que usuários realmente escrevem
- ✅ Variações coloquiais (ex: "manha" sem acento)
- ✅ Sinônimos comuns
- ✅ Formas flexionadas de verbos/substantivos
- ❌ Evitar termos técnicos ou clínicos
- ❌ Evitar jargões acadêmicos

## Geração de Insights Combinados

### Padrões de Combinação

O dicionário permite gerar insights combinados:

#### Temporal + Emocional
```
"Manhã + Ansiedade = período crítico"
"Fim de semana + Tédio = situação de risco"
```

#### Social + Comportamental
```
"Amigos + Álcool = contexto social de risco"
"Festa + Pressão Social = gatilho frequente"
```

#### Contextual + Emocional
```
"Casa + Solidão = ambiente de vulnerabilidade"
"Trabalho + Estresse = contexto crítico"
```

### Exemplo de Uso

```typescript
import { generateCombinedInsight } from './semanticDictionary';

const triggers = [
    { label: "Manhã", type: "temporal" },
    { label: "Ansiedade", type: "emocional" }
];

const insight = generateCombinedInsight(triggers);
// Retorna: "Manhã combinado com Ansiedade parece ser um período crítico."
```

## Estatísticas do Dicionário

Atualmente o dicionário contém:
- **25+ agrupamentos** organizados por categoria
- **150+ lemas** mapeados
- **100+ exemplos** de uso real
- **5 categorias**: temporal, emocional, social, comportamental, contextual

## Manutenção Contínua

### Quando Adicionar

1. **Novos termos frequentes**: Se um termo aparece muito nas notas mas não está no dicionário
2. **Variações regionais**: Diferentes formas de escrever o mesmo conceito
3. **Gírias e expressões**: Termos que usuários realmente usam
4. **Contextos específicos**: Situações particulares do hábito rastreado

### Processo Sugerido

1. Analisar notas reais dos usuários
2. Identificar termos frequentes não cobertos
3. Agrupar termos relacionados
4. Adicionar ao dicionário com exemplos
5. Testar extração de gatilhos
6. Ajustar pesos se necessário

## Boas Práticas

- **Labels claros**: Use termos que o usuário entende
- **Lemas completos**: Inclua todas as variações comuns
- **Exemplos reais**: Baseie-se em notas reais de usuários
- **Pesos consistentes**: Use pesos para priorizar gatilhos mais relevantes
- **Categorias corretas**: Classifique adequadamente para insights precisos

## Exemplo Completo

```typescript
// Agrupamento completo
alcool: {
    label: "Álcool",
    type: "comportamental",
    lemas: [
        "beber", "bebida", "bebidas", "álcool", "alcool",
        "cerveja", "cervejas", "vinho", "vinhos", 
        "whisky", "vodka", "cachaça", "pinga",
        "drink", "drinks", "bebi", "bebeu", "bebendo"
    ],
    exemplos: [
        "bebi depois do trabalho",
        "cerveja com amigos",
        "vinho no jantar",
        "drinks na festa"
    ],
    peso: 1.5 // Alto peso = gatilho muito relevante
}
```

Este agrupamento captura todas as formas comuns de mencionar álcool, permitindo que o sistema identifique o conceito mesmo quando escrito de formas diferentes.

