import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Alert, Animated, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as PhosphorIcons from "phosphor-react-native";
import {
    BookOpenTextIcon,
    ChatCenteredDotsIcon,
    ExportIcon,
    HeartbeatIcon,
    LightbulbFilamentIcon,
    PencilSimpleIcon
} from "phosphor-react-native";

import { Loading } from "@/components/Loading";
import { SettingButton } from "@/components/SettingButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AbstinenceCard } from "@/components/AbstinenceCard";

import { colors, fontFamily } from "@/theme";
import { HabitResponseDTO } from "@/dtos/habit.dto";
import { useHabitDatabase } from "@/database/useHabitDatabase";
import { useAffirmationDatabase } from "@/database/useAffirmationDatabase";
import { useHabitRecordDatabase, HabitRecordResponse } from "@/database/useHabitRecordDatabase";
import { Header } from "@/components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading } from "@/components/Text/Heading";
import { useTranslation } from "@/hooks/useTranslation";
import { IconButton } from "@/components/IconButton";

const { width } = Dimensions.get("window");

export default function Overview() {

    const insets = useSafeAreaInsets();

    const [habit, setHabit] = useState<HabitResponseDTO>(null);
    const [records, setRecords] = useState<HabitRecordResponse[]>([]);

    const [affirmations, setAffirmations] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const slideAnim = useRef(new Animated.Value(0)).current;

    const affirmationDatabase = useAffirmationDatabase();
    const { listByHabit } = useHabitRecordDatabase();

    const { id } = useLocalSearchParams();
    const habitId = Number(id);

    const habitDatabase = useHabitDatabase();
    const { t } = useTranslation();

    const handleDeleteHabit = async () => {
        try {
            Alert.alert(
                t("habit.deleteConfirm"),
                t("habit.deleteMessage"),
                [
                    { text: t("common.cancel"), style: "cancel" },
                    {
                        text: t("common.delete"),
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
            Alert.alert(t("common.error"), t("habit.deleteError"));
        }
    };

    const fetchHabit = async () => {
        try {
            const data = await habitDatabase.show(habitId);
            setHabit(data);
        } catch (error) {
            console.error("Erro ao buscar hábito:", error);
            Alert.alert(t("common.error"), t("habit.saveError"));
        }
    };

    const fetchRecords = async () => {
        try {
            const data = await listByHabit(habitId);
            setRecords(data);
        } catch (error) {
            console.error("Erro ao buscar registros:", error);
        }
    };

    useEffect(() => {
        fetchHabit();
        fetchRecords();
    }, [habitId]);

    // Recarregar hábito e registros quando a tela recebe foco (volta de outras telas)
    useFocusEffect(
        useCallback(() => {
            fetchHabit();
            fetchRecords(); // Recarregar registros para cálculo preciso da última recaída
        }, [habitId])
    );

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
            <Header transparent>
                <IconButton
                    Icon={PencilSimpleIcon}
                    onPress={() => router.push(`/create-habit/edit/${habitId}`)}
                />
            </Header>

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
                    <AbstinenceCard records={records} lastRelapseDate={habit.last_relapse_date} />

                    <Text style={styles.groupTitle}>
                        {t("overview.myJourney")}
                    </Text>

                    <View style={styles.group}>
                        <SettingButton
                            Icon={BookOpenTextIcon}
                            title={t("overview.activities")}
                            backgroundColor="#8A8D94"
                            rounded="top"
                            onPress={() => router.navigate("/(tabs)/overview/diary")}
                        />

                        <SettingButton
                            Icon={ChatCenteredDotsIcon}
                            title={t("overview.affirmations")}
                            backgroundColor="#0A84FF"
                            onPress={() => router.navigate("/(tabs)/overview/affirmations")}
                        />

                        <SettingButton
                            Icon={LightbulbFilamentIcon}
                            title={t("overview.reasons")}
                            backgroundColor="#FF453A"
                            onPress={() => router.navigate("/(tabs)/overview/reasons")}
                        />

                        <SettingButton
                            Icon={HeartbeatIcon}
                            title="Análise da Jornada"
                            backgroundColor="#6366F1"
                            rounded="bottom"
                            onPress={() => router.push(`/(tabs)/overview/journey-analysis?id=${habitId}`)}
                        />
                    </View>

                    <Text style={styles.groupTitle}>
                        {t("overview.options")}
                    </Text>

                    <PrimaryButton
                        label={t("overview.deleteHabit")}
                        onPress={handleDeleteHabit}
                        Icon={PhosphorIcons.TrashIcon}
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
    },
    buttonGroup: {
        gap: 12,
        //marginTop: 24
    }
})