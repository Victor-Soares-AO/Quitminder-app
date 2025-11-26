import quotes_pt from "@/assets/quotes/quotes_pt.json";

const quotesByLang = {
  pt: quotes_pt,
  // futuramente: en, es, fr...
} as const;

/**
 * Retorna o número do dia no ano atual (1–365/366)
 * Exemplo: 1 de janeiro → 1 | 10 de novembro → 314
 */
function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay); // 1..365/366
}

/**
 * Retorna a frase correspondente ao dia atual
 */
export function getQuoteOfTheDay(lang: keyof typeof quotesByLang = "pt") {
  const dayOfYear = getDayOfYear(); // Exemplo: 314 para 10 de novembro
  const quotes = quotesByLang[lang] ?? quotesByLang.pt;

  if (!Array.isArray(quotes) || quotes.length === 0) {
    return { id: 0, author: "Desconhecido", text: "" };
  }

  // Garante que o índice é válido (caso JSON tenha < 366 itens)
  const index = (dayOfYear - 1) % quotes.length;

  return quotes[index];
}
