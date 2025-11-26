export const categoryTranslations = {
  pt: {
    emotions: "Equilíbrio e Emoções",
    social: "Redes Sociais",
    physical_addictions: "Comida, Bebida e Substâncias",
    spending: "Gastos e Impulsos",
    // habits: "Hábitos",
    // rewards: "Recompensas",
  },
  en: {
    emotions: "Balance & Emotions",
    social: "Social Media",
    physical_addictions: "Food, Drink & Substances",
    spending: "Spending & Impulses",
    // habits: "Habits",
    // rewards: "Rewards",
  },
//   es: {
//     emotions: "Emociones",
//     social: "Redes Sociales",
//     physical_addictions: ""
//     // habits: "Hábitos",
//     // rewards: "Recompensas",
//   },
//   fr: {
//     emotions: "Émotions",
//     social: "Réseaux Sociaux",
//     physical_addictions: ""
//     // habits: "Habitudes",
//     // rewards: "Récompenses",
//   },
} as const;

export type SupportedLangs = keyof typeof categoryTranslations;
