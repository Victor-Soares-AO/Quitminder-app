# Função Centralizada: getLastRelapse()

## Problema Identificado

O sistema não estava usando a recaída cronologicamente mais recente como base para cálculos. Alguns lugares usavam:
- `find()` sem ordenação
- `filter()[0]` assumindo ordem do array
- Ordem implícita do banco de dados

## Solução

Função centralizada `getLastRelapse()` que:
1. **Nunca assume ordem**: sempre ordena explicitamente
2. **Retorna registro completo**: não apenas a data
3. **Garante consistência**: todos os cálculos usam a mesma fonte

## Funções Disponíveis

### `getLastRelapse(records)`
Retorna o registro completo da última recaída (is_reset === 1) mais recente cronologicamente.

**Uso:**
```typescript
const lastRelapse = getLastRelapse(records);
if (lastRelapse) {
    const date = lastRelapse.date_time;
    // Usar para cálculos
}
```

### `getAllRelapsesOrdered(records)`
Retorna todas as recaídas ordenadas cronologicamente (mais antiga primeiro).

**Uso:**
```typescript
const relapses = getAllRelapsesOrdered(records);
// relapses[0] = primeira recaída (mais antiga)
// relapses[relapses.length - 1] = última recaída (mais recente)
```

### `calculateDaysSinceLastRelapse(records)`
Calcula o número de dias desde a última recaída (streak atual).

**Uso:**
```typescript
const days = calculateDaysSinceLastRelapse(records);
// Retorna número de dias ou null se não houver recaídas
```

## Locais Refatorados

✅ `chartData.ts` - Gráficos de intervalos
✅ `calculateStatistics.ts` - Estatísticas gerais
✅ `analyzeJourney.ts` - Análise da jornada
✅ `extractTriggers.ts` - Extração de gatilhos

## Regras de Negócio

1. **Última recaída**: Sempre o registro com `is_reset === 1` mais recente
2. **Ordenação**: Nunca assumir ordem do array original
3. **Normalização**: Datas normalizadas para meia-noite local para cálculos precisos
4. **Sem recaídas**: Retornar `null` se não houver recaídas

## Exemplo de Uso Correto

```typescript
import { getLastRelapse, getAllRelapsesOrdered } from "./calculateLastRelapse";

// ✅ CORRETO: Usar função centralizada
const lastRelapse = getLastRelapse(records);
const daysSince = lastRelapse 
    ? Math.floor((Date.now() - new Date(lastRelapse.date_time).getTime()) / (1000 * 60 * 60 * 24))
    : null;

// ✅ CORRETO: Calcular intervalos entre recaídas
const relapses = getAllRelapsesOrdered(records);
for (let i = 1; i < relapses.length; i++) {
    const interval = calculateInterval(relapses[i-1], relapses[i]);
}

// ❌ ERRADO: Assumir ordem do array
const lastRelapse = records.filter(r => r.is_reset === 1)[0]; // Pode não ser o mais recente!

// ❌ ERRADO: Usar find() sem ordenação
const lastRelapse = records.find(r => r.is_reset === 1); // Pode não ser o mais recente!
```

