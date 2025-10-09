import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

import { List } from "@/components/List";
import { SuggestionCard } from "@/components/SuggestionCard";

import { colors } from "@/theme";

const habits = [
    { name: 'Custom Habit' },
    { name: 'Fast Food' },
    { name: 'Alcohol' },
    { name: 'Gambling' },
    { name: 'Porn' },
    { name: 'Smoking' },
    { name: 'Video Games' },
    { name: 'Impulsive Shopping' },
    { name: 'Coffee' },
    { name: 'Cursing' },
    { name: 'Procrastination' },
]

export default function CreateHabit() {

    return (
        <View style={styles.container}>
            <List
                data={habits}
                keyExtractor={(item) => item.name.toString()}
                renderItem={({ item }) => <SuggestionCard title={item.name} onPress={() => router.navigate('/create-habit/edit/1')} />}
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: colors.background.primary,
                    marginHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 56,
                    gap: 20
                }}
            />
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary
    }
});