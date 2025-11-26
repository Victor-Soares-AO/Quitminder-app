import { Alert, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Redirect, router, useFocusEffect } from "expo-router";

import { PlusIcon } from "phosphor-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { List } from "@/components/List";
import { Loading } from "@/components/Loading";
import { ListEmpty } from "@/components/ListEmpty";
import { HabitCard } from "@/components/HabitCard";
import { Highlight } from "@/components/Highlight";
import { HomeHeader } from "@/components/HomeHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";

import { colors } from "@/theme";
import { HabitResponseDTO } from "@/dtos/habit.dto";
import { ONBOARDING_COLLECTION } from "@/storage/storageConfig";
import { useHabitDatabase } from "@/database/useHabitDatabase";
import { useHabit } from "@/contexts/useHabit";

export type HabitCardProps = {
    id: string;
    name: string;
    cover: string;
    color: string;
    lastRelapseDate: string;
};


export default function Index() {

    const [isOnboardingViewed, setIsOnboardingViewed] = useState<boolean | null>(null);

    const [isFetching, setIsFetching] = useState(true);
    const [habits, setHabits] = useState<HabitCardProps[]>([]);

    const habitDatabase = useHabitDatabase();
    const { setHabit } = useHabit();

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(ONBOARDING_COLLECTION);
                // await AsyncStorage.setItem(ONBOARDING_COLLECTION, "false");
                // Se value for 'true', foi visto. Se for null/outro, não foi visto.
                setIsOnboardingViewed(value === 'true');
            } catch (error) {
                console.error("Erro ao ler o status do Onboarding:", error);
                setIsOnboardingViewed(false);
            }
        };

        checkOnboardingStatus();
    }, []);

    // Buscar hábitos salvos no banco
    const fetchHabits = async () => {
        try {
            setIsFetching(true);

            const response = await habitDatabase.list();

            const formatted = response.map((item) => ({
                id: String(item.id),
                name: item.name,
                color: item.color,
                cover: item.cover,
                lastRelapseDate: item.last_relapse_date
            }));

            setHabits(formatted);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar os hábitos.");
        } finally {
            setIsFetching(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabits();
        }, [])
    );
    // Mostra uma tela vazia ou de loading enquanto a verificação assíncrona acontece
    if (isOnboardingViewed === null) {
        return <Loading />;
    }

    // Se não foi visto, redireciona para o onboarding
    if (isOnboardingViewed === false) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: colors.background.primary, zIndex: -50 }}>
                <List
                    data={habits}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <HabitCard
                            color={item.color}
                            cover={item.cover}
                            name={item.name}
                            lastRelapseDate={item.lastRelapseDate}
                            // onPress={() => router.navigate(`/(tabs)/overview/${item.id}`)}
                            onPress={async () => {
                                try {
                                    const habit = await habitDatabase.show(Number(item.id));
                                    setHabit(habit);
                                    router.navigate(`/(tabs)/overview/${item.id}`);
                                } catch (error) {
                                    console.error("Erro ao abrir o hábito:", error);
                                    Alert.alert("Erro", "Não foi possível abrir este hábito.");
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 40,
                        backgroundColor: colors.background.primary,
                    }}
                    ListHeaderComponent={
                        <View style={{ paddingTop: 80 }}>
                            <HomeHeader />
                            <QuoteOfTheDay />
                            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                                <PrimaryButton
                                    onPress={() => router.navigate('/edit-habit/1')}
                                    Icon={PlusIcon}
                                    label="Adicionar"
                                />
                            </View>

                            {habits.length > 0 && <Highlight amount={habits.length} />}
                        </View>
                    }
                    ListEmptyComponent={<ListEmpty />}
                />
            </View>
        </>
    )
}