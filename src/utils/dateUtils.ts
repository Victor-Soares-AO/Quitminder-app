/**
 * Utilitários para manipulação segura de datas sem problemas de timezone
 * 
 * PROBLEMA COMUM:
 * - new Date("YYYY-MM-DD") interpreta como UTC meia-noite
 * - toISOString() sempre retorna UTC
 * - Isso causa deslocamento de +1 ou -1 dia dependendo do timezone local
 * 
 * SOLUÇÃO:
 * - Trabalhar apenas com componentes de data (ano, mês, dia)
 * - Comparar strings YYYY-MM-DD diretamente
 * - Nunca usar toISOString() para comparação de dias
 */

/**
 * Normaliza uma data para string YYYY-MM-DD usando componentes locais
 * Garante que a data seja interpretada no timezone local, não UTC
 */
export function normalizeDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Converte uma string de data (ISO ou YYYY-MM-DD) para YYYY-MM-DD
 * Trata tanto "2024-01-15T10:30:00Z" quanto "2024-01-15"
 */
export function parseDateStringToYYYYMMDD(dateString: string): string {
    // Se já está no formato YYYY-MM-DD, retorna direto
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Se tem timestamp, extrai apenas a parte da data
    const datePart = dateString.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
    }
    
    // Fallback: tenta criar Date e normalizar (pode ter problemas de timezone)
    // Mas é melhor que nada
    const date = new Date(dateString);
    return normalizeDateToYYYYMMDD(date);
}

/**
 * Cria uma Date no timezone local a partir de YYYY-MM-DD
 * Garante que a data seja meia-noite no timezone local, não UTC
 */
export function createLocalDateFromYYYYMMDD(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    // new Date(year, month, day) cria no timezone local
    return new Date(year, month - 1, day);
}

/**
 * Compara duas datas apenas pelo dia (ignora hora/timezone)
 * Retorna true se forem o mesmo dia
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
    const date1Str = typeof date1 === 'string' 
        ? parseDateStringToYYYYMMDD(date1)
        : normalizeDateToYYYYMMDD(date1);
    
    const date2Str = typeof date2 === 'string'
        ? parseDateStringToYYYYMMDD(date2)
        : normalizeDateToYYYYMMDD(date2);
    
    return date1Str === date2Str;
}

/**
 * Verifica se uma data é hoje
 */
export function isToday(date: Date | string): boolean {
    const today = normalizeDateToYYYYMMDD(new Date());
    const dateStr = typeof date === 'string'
        ? parseDateStringToYYYYMMDD(date)
        : normalizeDateToYYYYMMDD(date);
    
    return today === dateStr;
}

