export type HabitSuggestion = {
    name: string;
    icon: string;
    color: string;
    isCustom?: boolean;
};

export const habitSuggestions: HabitSuggestion[] = [
    { name: "Criar hábito personalizado", icon: "Star", color: "#6366F1", isCustom: true },
    //{ name: "Fumar", icon: "Cigarette", color: "#F04444" },
    //{ name: "Álcool", icon: "BeerBottle", color: "#F97216" },
    { name: "Fast Food", icon: "Hamburger", color: "#F49E0B" },
    { name: "Jogos", icon: "GameController", color: "#6366F1" },
    { name: "Compras Impulsivas", icon: "ShoppingCart", color: "#D946EF" },
    { name: "Redes Sociais", icon: "InstagramLogo", color: "#F43F5E" },
    { name: "Café", icon: "Coffee", color: "#F97216" },
    { name: "Pornografia", icon: "Monitor", color: "#64748B" },
    { name: "Jogos de Azar", icon: "DiceSix", color: "#F04444" },
    { name: "Procrastinação", icon: "Clock", color: "#71717B" },
    { name: "Doces", icon: "Cookie", color: "#F49E0B" },
    { name: "Refrigerante", icon: "PintGlass", color: "#10B982" },
];

