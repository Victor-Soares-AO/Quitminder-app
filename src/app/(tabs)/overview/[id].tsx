import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Alert, Animated, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as PhosphorIcons from "phosphor-react-native";
import {
    ArrowLeftIcon,
    BookOpenTextIcon,
    ChatCenteredDotsIcon,
    ExportIcon,
    HeartbeatIcon,
    LightbulbFilamentIcon
} from "phosphor-react-native";

import { Loading } from "@/components/Loading";
import { IconButton } from "@/components/IconButton";
import { SettingButton } from "@/components/SettingButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AbstinenceCard } from "@/components/AbstinenceCard";

import { colors, fontFamily } from "@/theme";
import { HabitResponseDTO } from "@/dtos/habit.dto";
import { useHabitDatabase } from "@/database/useHabitDatabase";
import { useAffirmationDatabase } from "@/database/useAffirmationDatabase";
import { Header } from "@/components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading } from "@/components/Text/Heading";

const { width } = Dimensions.get("window");

export default function Overview() {

    const insets = useSafeAreaInsets();

    const [habit, setHabit] = useState<HabitResponseDTO>(null);

    const [affirmations, setAffirmations] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const fadeAnim = useRef(new Animated.Value(1)).current;

    const slideAnim = useRef(new Animated.Value(0)).current;

    const affirmationDatabase = useAffirmationDatabase();

    const { id } = useLocalSearchParams();
    const habitId = Number(id);

    const habitDatabase = useHabitDatabase();

    const handleDeleteHabit = async () => {
        try {
            Alert.alert(
                "Confirmar exclusão",
                "Tem certeza que deseja deletar este hábito? Todos os registros serão removidos.",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Deletar",
                        style: "destructive",
                        onPress: async () => {
                            await habitDatabase.remove(habitId);
                            router.back();
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Erro ao deletar hábito:", error);
            Alert.alert("Erro", "Não foi possível deletar o hábito.");
        }
    };

    useEffect(() => {
        const fetchHabit = async () => {
            try {
                const data = await habitDatabase.show(habitId);
                setHabit(data);
            } catch (error) {
                console.error("Erro ao buscar hábito:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do hábito.");
            }
        };

        fetchHabit();
    }, [habitId]);

    // Carregar frases positivas
    const fetchAffirmations = async () => {
        try {
            const data = await affirmationDatabase.listByHabit(habitId);

            if (data.length > 0)
                setAffirmations(data.map((a) => a.text));

        } catch (error) {
            console.error("Erro ao carregar afirmações:", error);
        }
    };

    useEffect(() => {
        fetchAffirmations();
    }, [habit]);

    useFocusEffect(
        useCallback(() => {
            fetchAffirmations();
        }, [])
    );

    // Animação de swipe lateral
    useEffect(() => {
        if (affirmations.length === 0) return;

        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            setCurrentIndex((prev) => (prev + 1) % affirmations.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [affirmations]);

    // Loading enquanto carrega
    if (habit === null) {
        return <Loading />;
    }

    const IconComponent = PhosphorIcons[habit.cover];

    return (
        <React.Fragment>
            <Header transparent />

            <ScrollView style={styles.container} bounces={false}>
                {/* Highlight */}
                <LinearGradient
                    colors={["#DCE6ED", "#F1F4F5"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                        paddingTop: insets.top + 80,
                        paddingBottom: 32,
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={[
                            styles.habitCover,
                            { backgroundColor: habit.color }
                        ]}
                    >
                        <IconComponent
                            size={48}
                            color={colors.white}
                            weight="fill"
                        />
                    </View>

                    <View style={{ alignItems: 'center', gap: 8 }}>
                        <Heading fontSize="LARGE">
                            {habit?.name}
                        </Heading>

                        <View style={{ width: width * 0.8, overflow: "hidden" }}>
                            <Animated.Text
                                style={[
                                    styles.positiveQuotes,
                                    { transform: [{ translateX: slideAnim }] },
                                ]}
                                numberOfLines={1}
                            >
                                {affirmations[currentIndex]}
                            </Animated.Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Conteúdo */}
                <View style={styles.wrapper}>
                    <AbstinenceCard lastRelapseDate={habit.last_relapse_date} />

                    <Text style={styles.groupTitle}>
                        Minha Jornada
                    </Text>

                    <View style={styles.group}>
                        <SettingButton
                            Icon={BookOpenTextIcon}
                            title="Diário de Atividades"
                            backgroundColor="#8A8D94"
                            rounded="top"
                            onPress={() => router.navigate("/(tabs)/overview/diary")}
                        />

                        <SettingButton
                            Icon={ChatCenteredDotsIcon}
                            title="Frases Positivas"
                            backgroundColor="#0A84FF"
                            onPress={() => router.navigate("/(tabs)/overview/affirmations")}
                        />

                        <SettingButton
                            Icon={HeartbeatIcon}
                            title="Teste Diagnóstico"
                            backgroundColor="#6366F1"
                        />

                        <SettingButton
                            Icon={LightbulbFilamentIcon}
                            title="Razões de Desistir"
                            backgroundColor="#FF453A"
                            rounded="bottom"
                            onPress={() => router.navigate("/(tabs)/overview/reasons")}
                        />
                    </View>

                    <Text style={styles.groupTitle}>
                        Opções
                    </Text>

                    <View style={styles.group}>
                        <SettingButton
                            Icon={ExportIcon}
                            iconWeight="bold"
                            title="Partilhar Progresso"
                            backgroundColor="#3A3A3C"
                            rounded="full"
                        />
                    </View>

                    <PrimaryButton
                        label="Deletar Hábito"
                        onPress={handleDeleteHabit}
                    />
                </View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    habitCover: {
        width: 96,
        height: 96,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        marginBottom: 24
    },
    positiveQuotes: {
        color: colors.text.secondary,
        fontSize: 16,
        fontFamily: fontFamily.medium,
        textAlign: 'center',
        lineHeight: 24
    },
    group: {

    },
    groupTitle: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.secondary,
        marginTop: 24,
        marginBottom: 16
    }
})