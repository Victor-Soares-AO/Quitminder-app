import categories from "./categories.json";
import { categoryTranslations, SupportedLangs } from "./categoryTranslations";

export function getIconCategories(lang: SupportedLangs = "pt") {
  const translations = categoryTranslations[lang] ?? categoryTranslations.pt;

  return Object.entries(categories).map(([key, icons]) => ({
    id: key,
    title: translations[key as keyof typeof translations] ?? key,
    icons,
  }));
}
