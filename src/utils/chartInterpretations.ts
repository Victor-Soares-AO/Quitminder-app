import { DayOfWeekData, PeriodOfDayData, IntervalData } from "./chartData";

/**
 * Gera interpretação automática para recaídas por dia da semana
 */
export function interpretDayOfWeekPattern(data: DayOfWeekData[]): string {
    if (data.length === 0 || data.every(d => d.count === 0)) {
        return "Não há dados suficientes de recaídas para identificar padrões por dia da semana.";
    }

    const maxCount = Math.max(...data.map(d => d.count));
    const maxDay = data.find(d => d.count === maxCount);
    
    if (!maxDay || maxCount === 0) {
        return "Não foi possível identificar um padrão claro de recaídas por dia da semana.";
    }

    const totalRelapses = data.reduce((sum, d) => sum + d.count, 0);
    const percentage = Math.round((maxCount / totalRelapses) * 100);
    
    // Verificar se há um padrão claro (mais de 30% das recaídas em um único dia)
    if (percentage >= 30) {
        return `Observa-se maior incidência de recaídas às ${maxDay.day.toLowerCase()}s-feiras (${maxCount} recaída${maxCount !== 1 ? 's' : ''}, ${percentage}% do total), indicando um período mais sensível.`;
    }

    // Verificar se há múltiplos dias com recaídas similares
    const daysWithRelapses = data.filter(d => d.count > 0).length;
    if (daysWithRelapses >= 4) {
        return `As recaídas estão distribuídas ao longo da semana, sem um padrão claro de concentração em dias específicos.`;
    }

    // Padrão moderado
    return `Observa-se uma tendência de maior incidência de recaídas às ${maxDay.day.toLowerCase()}s-feiras, sugerindo atenção especial neste período.`;
}

/**
 * Gera interpretação automática para recaídas por período do dia
 */
export function interpretPeriodOfDayPattern(data: PeriodOfDayData[]): string {
    if (data.length === 0 || data.every(d => d.count === 0)) {
        return "Não há dados suficientes de recaídas para identificar padrões por período do dia.";
    }

    const maxCount = Math.max(...data.map(d => d.count));
    const maxPeriod = data.find(d => d.count === maxCount);
    
    if (!maxPeriod || maxCount === 0) {
        return "Não foi possível identificar um padrão claro de recaídas por período do dia.";
    }

    const totalRelapses = data.reduce((sum, d) => sum + d.count, 0);
    const percentage = Math.round((maxCount / totalRelapses) * 100);
    
    // Verificar se há um padrão claro (mais de 40% das recaídas em um único período)
    if (percentage >= 40) {
        return `A maioria das recaídas ocorre no período ${maxPeriod.period.toLowerCase()} (${maxCount} recaída${maxCount !== 1 ? 's' : ''}, ${percentage}% do total), sugerindo maior vulnerabilidade nesse horário.`;
    }

    // Verificar se há distribuição equilibrada
    const periodsWithRelapses = data.filter(d => d.count > 0).length;
    if (periodsWithRelapses >= 3) {
        const avgCount = totalRelapses / periodsWithRelapses;
        const isBalanced = data.filter(d => d.count > 0).every(d => Math.abs(d.count - avgCount) <= avgCount * 0.3);
        
        if (isBalanced) {
            return `As recaídas estão distribuídas ao longo do dia, sem concentração em um período específico.`;
        }
    }

    // Padrão moderado
    return `Observa-se uma tendência de maior incidência de recaídas no período ${maxPeriod.period.toLowerCase()}, indicando necessidade de atenção especial nesse horário.`;
}

/**
 * Gera interpretação automática para evolução do intervalo entre recaídas
 */
export function interpretIntervalEvolution(data: IntervalData[]): string {
    if (data.length < 3) {
        return "Não há dados suficientes para analisar a evolução do intervalo entre recaídas.";
    }

    // Calcular tendência (aumento ou diminuição)
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const avgFirstHalf = firstHalf.reduce((sum, d) => sum + d.interval, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((sum, d) => sum + d.interval, 0) / secondHalf.length;
    
    const change = avgSecondHalf - avgFirstHalf;
    const changePercentage = Math.abs((change / avgFirstHalf) * 100);

    // Se a mudança for significativa (mais de 20%)
    if (changePercentage >= 20) {
        if (change > 0) {
            return `O intervalo médio entre recaídas apresenta tendência de aumento (de ${avgFirstHalf.toFixed(1)} para ${avgSecondHalf.toFixed(1)} dias), indicando progresso na jornada.`;
        } else {
            return `O intervalo médio entre recaídas apresenta tendência de diminuição (de ${avgFirstHalf.toFixed(1)} para ${avgSecondHalf.toFixed(1)} dias), sugerindo necessidade de atenção e estratégias de prevenção.`;
        }
    }

    // Se a mudança for moderada (10-20%)
    if (changePercentage >= 10) {
        if (change > 0) {
            return `Observa-se uma leve tendência de aumento no intervalo entre recaídas, sugerindo melhoria gradual.`;
        } else {
            return `Observa-se uma leve tendência de diminuição no intervalo entre recaídas, indicando necessidade de reforço nas estratégias.`;
        }
    }

    // Padrão estável
    const overallAvg = data.reduce((sum, d) => sum + d.interval, 0) / data.length;
    return `O intervalo entre recaídas mantém-se relativamente estável (média de ${overallAvg.toFixed(1)} dias), indicando um padrão consistente.`;
}

