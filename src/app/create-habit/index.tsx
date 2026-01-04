import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

import { List } from "@/components/List";
import { SuggestionCard } from "@/components/SuggestionCard";
import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { Description } from "@/components/Text/Description";
import { useHabit } from "@/contexts/useHabit";
import { useHabitDatabase } from "@/database/useHabitDatabase";

import { colors } from "@/theme";
import { habitSuggestions } from "@/constants/habitSuggestions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateHabit() {
    const insets = useSafeAreaInsets();
    const { setHabit } = useHabit();
    const { show } = useHabitDatabase();

    const handleSuggestionPress = (suggestion: typeof habitSuggestions[0]) => {
        if (suggestion.isCustom) {
            // Para hábito personalizado, navegar sem parâmetros (será usado os valores padrão)
            router.push('/create-habit/edit/1');
        } else {
            // Para sugestões, navegar com os dados pré-preenchidos
            router.push({
                pathname: '/create-habit/edit/1',
                params: {
                    name: suggestion.name,
                    icon: suggestion.icon,
                    color: suggestion.color,
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <List
                    data={habitSuggestions}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <SuggestionCard
                            title={item.name}
                            icon={item.icon}
                            color={item.color}
                            onPress={() => handleSuggestionPress(item)}
                        />
                    )}
                    contentContainerStyle={{
                        flexGrow: 1,
                        backgroundColor: colors.background.primary,
                        paddingBottom: 56,
                        paddingTop: 32,
                        gap: 12
                    }}
                />
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16
    }
});