import { useLanguage } from "@/contexts/useLanguage";
import { t } from "@/i18n";

export function useTranslation() {
    const { language } = useLanguage();
    
    return {
        t: (key: string, params?: Record<string, string | number>) => t(key, language, params),
        language,
    };
}

