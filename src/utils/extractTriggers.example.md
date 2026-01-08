# Exemplo de Uso - Extração de Gatilhos Semânticos

## Entrada (Notas de Recaídas)

```typescript
const records = [
  {
    id: 1,
    note: "Bebi depois do trabalho. Estava muito estressado com o chefe.",
    title: "Recaída no trabalho",
    is_reset: 1
  },
  {
    id: 2,
    note: "Cerveja com amigos no sábado à noite. Foi difícil resistir.",
    title: "Fim de semana",
    is_reset: 1
  },
  {
    id: 3,
    note: "Quando estou triste, sempre acabo bebendo. Hoje foi pior.",
    title: "Tristeza",
    is_reset: 1
  },
  {
    id: 4,
    note: "Álcool após o almoço. Estava ansioso com a reunião.",
    title: "Ansiedade",
    is_reset: 1
  },
  {
    id: 5,
    note: "Bebi antes de ir para casa. Estava nervoso com a família.",
    title: "Família",
    is_reset: 1
  }
];
```

## Saída Esperada

```typescript
[
  {
    label: "Depois do trabalho",
    type: "comportamental",
    confidence: 0.85
  },
  {
    label: "Álcool",
    type: "comportamental",
    confidence: 0.78
  },
  {
    label: "Sábado à noite",
    type: "temporal",
    confidence: 0.72
  },
  {
    label: "Tristeza",
    type: "emocional",
    confidence: 0.68
  },
  {
    label: "Amigos",
    type: "social",
    confidence: 0.65
  },
  {
    label: "Estresse",
    type: "emocional",
    confidence: 0.62
  }
]
```

## Como Funciona

1. **Detecção de Padrões**: Identifica frases como "depois do trabalho", "quando estou triste"
2. **Agrupamento Semântico**: "cerveja", "vinho", "bebida" → "Álcool"
3. **Classificação**: Categoriza automaticamente em temporal, emocional, social ou comportamental
4. **Cálculo de Confiança**: Baseado em frequência e diversidade de contextos

