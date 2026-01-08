import { IntervalData } from "./chartData";

/**
 * Simplifica dados de evolução de intervalos para visualização clara
 * 
 * Objetivo: Comunicar TENDÊNCIA (aumento, estabilidade, diminuição)
 * sem excesso de detalhes.
 * 
 * Estratégia:
 * - Agrupar intervalos em períodos (primeira metade vs segunda metade)
 * - Retornar apenas 2-3 pontos representativos
 * - Focar na mensagem: melhorou, piorou ou estável
 */
export type SimplifiedInterval = {
    label: string;
    value: number;
    period: 'inicial' | 'recente';
};

/**
 * Simplifica dados de intervalos para visualização de tendência
 */
export function simplifyIntervalEvolution(data: IntervalData[]): SimplifiedInterval[] {
    if (data.length < 3) {
        return [];
    }
    
    // Dividir em duas metades
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    // Calcular média de cada metade
    const avgFirst = firstHalf.reduce((sum, d) => sum + d.interval, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, d) => sum + d.interval, 0) / secondHalf.length;
    
    const result: SimplifiedInterval[] = [
        {
            label: 'Início',
            value: Math.round(avgFirst * 10) / 10,
            period: 'inicial'
        }
    ];
    
    // Se houver diferença significativa, adicionar ponto intermediário
    const change = avgSecond - avgFirst;
    const changePercent = Math.abs((change / avgFirst) * 100);
    
    if (changePercent > 15 && data.length >= 6) {
        // Adicionar ponto do meio se houver mudança significativa
        const middlePoint = Math.floor(data.length / 2);
        const middleValue = data[middlePoint].interval;
        result.push({
            label: 'Meio',
            value: Math.round(middleValue * 10) / 10,
            period: 'inicial'
        });
    }
    
    result.push({
        label: 'Agora',
        value: Math.round(avgSecond * 10) / 10,
        period: 'recente'
    });
    
    return result;
}

/**
 * Gera insight simplificado sobre a evolução
 */
export function generateSimpleEvolutionInsight(data: IntervalData[]): { headline: string; subtext: string } | null {
    if (data.length < 3) {
        return null;
    }
    
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const avgFirst = firstHalf.reduce((sum, d) => sum + d.interval, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, d) => sum + d.interval, 0) / secondHalf.length;
    
    const change = avgSecond - avgFirst;
    const changePercent = Math.abs((change / avgFirst) * 100);
    
    // Mudança significativa (>20%)
    if (changePercent >= 20) {
        if (change > 0) {
            const improvement = Math.round(changePercent);
            return {
                headline: `Intervalo entre recaídas aumentou ${improvement}%`,
                subtext: `Progresso consistente. Continue com as estratégias que estão funcionando.`
            };
        } else {
            const decline = Math.round(changePercent);
            return {
                headline: `Intervalo entre recaídas diminuiu ${decline}%`,
                subtext: `Reavalie suas estratégias. Considere buscar apoio adicional ou ajustar sua abordagem.`
            };
        }
    }
    
    // Mudança moderada (10-20%)
    if (changePercent >= 10) {
        if (change > 0) {
            return {
                headline: `Intervalo entre recaídas em leve aumento`,
                subtext: `Tendência positiva. Mantenha o foco e continue com suas estratégias preventivas.`
            };
        } else {
            return {
                headline: `Intervalo entre recaídas em leve diminuição`,
                subtext: `Atenção necessária. Reforce suas estratégias e identifique possíveis gatilhos recentes.`
            };
        }
    }
    
    // Padrão estável
    const overallAvg = data.reduce((sum, d) => sum + d.interval, 0) / data.length;
    return {
        headline: `Intervalo médio de ${overallAvg.toFixed(1)} dias`,
        subtext: `Padrão estável. Considere experimentar novas estratégias para aumentar os intervalos.`
    };
}

