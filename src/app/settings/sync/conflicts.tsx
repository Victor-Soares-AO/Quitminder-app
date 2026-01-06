import { useState } from "react";
import { StyleSheet, ScrollView, View, Alert, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, CheckCircleIcon, ArrowDownIcon, ArrowUpIcon } from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconButton } from "@/components/IconButton";

import { colors, fontFamily } from "@/theme";
import { useColors } from "@/hooks/useColors";
import type { ConflictResolution } from "@/services/sync";

export default function ConflictsScreen() {
    const colors = useColors();
    const params = useLocalSearchParams();
    
    // Parse conflicts from params
    const conflictsParam = params.conflicts as string;
    const conflicts: ConflictResolution[] = conflictsParam ? JSON.parse(conflictsParam) : [];
    
    const [resolutions, setResolutions] = useState<Record<number, 'local' | 'cloud'>>({});

    const handleResolve = (habitId: number, action: 'local' | 'cloud') => {
        setResolutions(prev => ({
            ...prev,
            [habitId]: action,
        }));
    };

    const handleApplyResolutions = () => {
        // Aplicar resoluções
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Header transparent>
                <IconButton
                    Icon={X}
                    IconWeight="bold"
                    onPress={() => router.back()}
                />
            </Header>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Heading fontSize="LARGE" style={styles.heading}>
                        Resolver Conflitos
                    </Heading>
                    <Description style={styles.description}>
                        Foram encontrados {conflicts.length} conflito(s). Escolha qual versão manter para cada hábito.
                    </Description>
                </View>

                {conflicts.map((conflict) => {
                    const resolution = resolutions[conflict.habitId];
                    const localDate = new Date(conflict.localUpdatedAt);
                    const cloudDate = new Date(conflict.cloudUpdatedAt);

                    return (
                        <View key={conflict.habitId} style={[styles.conflictCard, { backgroundColor: colors.background.secondary }]}>
                            <Title fontSize="MEDIUM" style={styles.conflictTitle}>
                                Hábito #{conflict.habitId}
                            </Title>
                            
                            <View style={styles.conflictInfo}>
                                <View style={styles.versionOption}>
                                    <Text style={[styles.versionLabel, { color: colors.text.secondary }]}>
                                        Versão Local
                                    </Text>
                                    <Text style={[styles.versionDate, { color: colors.text.secondary }]}>
                                        {localDate.toLocaleString('pt-PT')}
                                    </Text>
                                </View>

                                <View style={styles.versionOption}>
                                    <Text style={[styles.versionLabel, { color: colors.text.secondary }]}>
                                        Versão Nuvem
                                    </Text>
                                    <Text style={[styles.versionDate, { color: colors.text.secondary }]}>
                                        {cloudDate.toLocaleString('pt-PT')}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.actionButton,
                                        resolution === 'local' && { backgroundColor: colors.text.primary },
                                        { borderColor: colors.gray[300] }
                                    ]}
                                    onPress={() => handleResolve(conflict.habitId, 'local')}
                                >
                                    <ArrowUpIcon 
                                        size={20} 
                                        color={resolution === 'local' ? colors.white : colors.text.primary} 
                                    />
                                    <Text style={[
                                        styles.actionButtonText,
                                        { color: resolution === 'local' ? colors.white : colors.text.primary }
                                    ]}>
                                        Manter Local
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionButton,
                                        resolution === 'cloud' && { backgroundColor: colors.text.primary },
                                        { borderColor: colors.gray[300] }
                                    ]}
                                    onPress={() => handleResolve(conflict.habitId, 'cloud')}
                                >
                                    <ArrowDownIcon 
                                        size={20} 
                                        color={resolution === 'cloud' ? colors.white : colors.text.primary} 
                                    />
                                    <Text style={[
                                        styles.actionButtonText,
                                        { color: resolution === 'cloud' ? colors.white : colors.text.primary }
                                    ]}>
                                        Usar Nuvem
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                <PrimaryButton
                    label="Aplicar Resoluções"
                    Icon={CheckCircleIcon}
                    onPress={handleApplyResolutions}
                    disabled={Object.keys(resolutions).length !== conflicts.length}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    heading: {
        marginBottom: 8,
    },
    description: {
        marginBottom: 32,
    },
    conflictCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    conflictTitle: {
        marginBottom: 16,
    },
    conflictInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    versionOption: {
        flex: 1,
    },
    versionLabel: {
        fontSize: 12,
        fontFamily: fontFamily.medium,
        marginBottom: 4,
    },
    versionDate: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
    },
});

