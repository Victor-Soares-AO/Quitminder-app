import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupportedLangs } from "@/constants/icons/categoryTranslations";

const LANGUAGE_COLLECTION = '@QuitMinder:language';

type LanguageContextData = {
    language: SupportedLangs;
    setLanguage: (lang: SupportedLangs) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextData | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<SupportedLangs>("pt");

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_COLLECTION);
            if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
                setLanguageState(savedLanguage as SupportedLangs);
            }
        } catch (error) {
            console.error("Erro ao carregar idioma:", error);
        }
    };

    const setLanguage = async (lang: SupportedLangs) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_COLLECTION, lang);
            setLanguageState(lang);
            console.log("Idioma alterado para:", lang);
        } catch (error) {
            console.error("Erro ao salvar idioma:", error);
            throw error;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguageContext() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguageContext deve ser usado dentro de um LanguageProvider");
    }
    return context;
}

