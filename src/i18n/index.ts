import { translations } from "./translations";
import { SupportedLangs } from "@/constants/icons/categoryTranslations";

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKeys = NestedKeyOf<typeof translations.pt>;

export function t(key: TranslationKeys, lang: SupportedLangs = "pt", params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            // Fallback para português se não encontrar
            value = translations.pt;
            for (const k2 of keys) {
                value = value?.[k2];
            }
            break;
        }
    }

    if (typeof value !== "string") {
        return key; // Retorna a chave se não encontrar
    }

    // Substituir parâmetros {param}
    if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey]?.toString() || match;
        });
    }

    return value;
}

