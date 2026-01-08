import { DayOfWeekData, PeriodOfDayData, IntervalData } from "./chartData";

export type Insight = {
    headline: string;
    subtext: string;
};

/**
 * Gera insight acionável para recaídas por dia da semana
 */
export function generateDayOfWeekInsight(data: DayOfWeekData[]): Insight | null {
    if (data.length === 0 || data.every(d => d.count === 0)) {
        return null;
    }

    const totalRelapses = data.reduce((sum, d) => sum + d.count, 0);
    if (totalRelapses === 0) return null;

    const maxCount = Math.max(...data.map(d => d.count));
    const maxDay = data.find(d => d.count === maxCount);
    
    if (!maxDay) return null;

    const percentage = Math.round((maxCount / totalRelapses) * 100);
    
    // Dominância clara (>50%)
    if (percentage >= 50) {
        return {
            headline: `${percentage}% das recaídas ocorrem às ${maxDay.day.toLowerCase()}s-feiras`,
            subtext: `Planeje atividades alternativas e estratégias de prevenção para este dia da semana.`,
        };
    }

    // Padrão moderado (30-50%)
    if (percentage >= 30) {
        return {
            headline: `${maxCount} recaída${maxCount !== 1 ? 's' : ''} às ${maxDay.day.toLowerCase()}s-feiras (${percentage}% do total)`,
            subtext: `Este dia apresenta maior vulnerabilidade. Considere reforçar seu sistema de apoio neste período.`,
        };
    }

    // Distribuição equilibrada
    const daysWithRelapses = data.filter(d => d.count > 0).length;
    if (daysWithRelapses >= 5) {
        return {
            headline: `Recaídas distribuídas ao longo da semana`,
            subtext: `Sem padrão claro de concentração. Mantenha estratégias preventivas consistentes todos os dias.`,
        };
    }

    // Padrão leve
    return {
        headline: `Tendência de maior incidência às ${maxDay.day.toLowerCase()}s-feiras`,
        subtext: `Fique atento neste dia e prepare alternativas para momentos de vulnerabilidade.`,
    };
}

/**
 * Gera insight acionável para recaídas por período do dia
 */
export function generatePeriodOfDayInsight(data: PeriodOfDayData[]): Insight | null {
    if (data.length === 0 || data.every(d => d.count === 0)) {
        return null;
    }

    const totalRelapses = data.reduce((sum, d) => sum + d.count, 0);
    if (totalRelapses === 0) return null;

    const maxCount = Math.max(...data.map(d => d.count));
    const maxPeriod = data.find(d => d.count === maxCount);
    
    if (!maxPeriod) return null;

    const percentage = Math.round((maxCount / totalRelapses) * 100);
    
    // Dominância clara (>50%)
    if (percentage >= 50) {
        const periodLower = maxPeriod.period.toLowerCase();
        return {
            headline: `${percentage}% das recaídas ocorrem pela ${periodLower}`,
            subtext: `Este horário requer atenção especial. Planeje atividades que ocupem sua mente neste período.`,
        };
    }

    // Padrão moderado (40-50%)
    if (percentage >= 40) {
        const periodLower = maxPeriod.period.toLowerCase();
        return {
            headline: `${maxCount} recaída${maxCount !== 1 ? 's' : ''} pela ${periodLower} (${percentage}% do total)`,
            subtext: `Maior vulnerabilidade neste horário. Estabeleça rotinas preventivas específicas para este período.`,
        };
    }

    // Distribuição equilibrada
    const periodsWithRelapses = data.filter(d => d.count > 0).length;
    if (periodsWithRelapses >= 3) {
        const avgCount = totalRelapses / periodsWithRelapses;
        const isBalanced = data.filter(d => d.count > 0).every(d => 
            Math.abs(d.count - avgCount) <= avgCount * 0.3
        );
        
        if (isBalanced) {
            return {
                headline: `Recaídas distribuídas ao longo do dia`,
                subtext: `Sem concentração em período específico. Mantenha vigilância constante durante todo o dia.`,
            };
        }
    }

    // Padrão leve
    const periodLower = maxPeriod.period.toLowerCase();
    return {
        headline: `Tendência de maior incidência pela ${periodLower}`,
        subtext: `Fique atento neste horário e prepare estratégias preventivas específicas.`,
    };
}

/**
 * Gera insight acionável para evolução do intervalo entre recaídas
 */
export function generateIntervalEvolutionInsight(data: IntervalData[]): Insight | null {
    if (data.length < 3) {
        return null;
    }

    // Calcular tendência comparando primeira e segunda metade
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const avgFirstHalf = firstHalf.reduce((sum, d) => sum + d.interval, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((sum, d) => sum + d.interval, 0) / secondHalf.length;
    
    const change = avgSecondHalf - avgFirstHalf;
    const changePercentage = Math.abs((change / avgFirstHalf) * 100);

    // Tendência significativa de melhoria (>20% aumento)
    if (changePercentage >= 20 && change > 0) {
        const improvement = Math.round(changePercentage);
        return {
            headline: `Intervalo entre recaídas aumentou ${improvement}%`,
            subtext: `Progresso consistente! Continue com as estratégias que estão funcionando.`,
        };
    }

    // Tendência significativa de piora (>20% diminuição)
    if (changePercentage >= 20 && change < 0) {
        const decline = Math.round(changePercentage);
        return {
            headline: `Intervalo entre recaídas diminuiu ${decline}%`,
            subtext: `Reavalie suas estratégias. Considere buscar apoio adicional ou ajustar sua abordagem.`,
        };
    }

    // Tendência moderada de melhoria (10-20% aumento)
    if (changePercentage >= 10 && change > 0) {
        return {
            headline: `Intervalo entre recaídas em leve aumento`,
            subtext: `Tendência positiva. Mantenha o foco e continue com suas estratégias preventivas.`,
        };
    }

    // Tendência moderada de piora (10-20% diminuição)
    if (changePercentage >= 10 && change < 0) {
        return {
            headline: `Intervalo entre recaídas em leve diminuição`,
            subtext: `Atenção necessária. Reforce suas estratégias e identifique possíveis gatilhos recentes.`,
        };
    }

    // Padrão estável
    const overallAvg = data.reduce((sum, d) => sum + d.interval, 0) / data.length;
    return {
        headline: `Intervalo médio de ${overallAvg.toFixed(1)} dias entre recaídas`,
        subtext: `Padrão estável. Considere experimentar novas estratégias para aumentar os intervalos.`,
    };
}

