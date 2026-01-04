import { Text, View } from "react-native";
import { ChatTeardropDotsIcon } from "phosphor-react-native";

import { colors } from "@/theme";
import { styles } from "./styles";
import { Title } from "../Text/Title";
import { Description } from "../Text/Description";
import { getQuoteOfTheDay } from "@/utils/getQuoteOfTheDay";
import { GlassView } from "expo-glass-effect";
import { useLanguage } from "@/contexts/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";

export function QuoteOfTheDay() {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const quote = getQuoteOfTheDay(language);

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <ChatTeardropDotsIcon weight="fill" color={colors.text.secondary} />
                <Title color="SECONDARY" fontWeight="SEMIBOLD">
                    {t("quote.title")}
                </Title>
            </View>

            <Title color="SECONDARY" fontWeight="SEMIBOLD">
                {quote.text}
            </Title>

            <View style={{ alignItems: "flex-end" }}>
                <Description color="SECONDARY" fontWeight="SEMIBOLD">
                    @{quote.author}
                </Description>
            </View>
        </View>
    );
}
