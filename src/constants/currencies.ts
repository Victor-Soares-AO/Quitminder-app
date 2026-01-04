export type Currency = {
    code: string;
    name: string;
    symbol?: string;
};

export const currencies: Currency[] = [
    { code: "AOA", name: "Kwanza Angolano", symbol: "Kz" },
    { code: "USD", name: "Dólar Americano", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
    { code: "GBP", name: "Libra Esterlina", symbol: "£" },
    { code: "JPY", name: "Iene Japonês", symbol: "¥" },
    { code: "CNY", name: "Yuan Chinês", symbol: "¥" },
    { code: "INR", name: "Rupia Indiana", symbol: "₹" },
    { code: "ZAR", name: "Rand Sul-Africano", symbol: "R" },
    { code: "NGN", name: "Naira Nigeriana", symbol: "₦" },
];


