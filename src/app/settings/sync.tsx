import { useState, useEffect, useCallback } from "react";
import { StyleSheet, ScrollView, View, Alert, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CloudArrowUpIcon, CloudArrowDownIcon, ArrowsClockwiseIcon, SignOutIcon, UserSwitchIcon } from "phosphor-react-native";
import { useSQLiteContext } from "expo-sqlite";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconButton } from "@/components/IconButton";
import { X } from "phosphor-react-native";

import { colors, fontFamily } from "@/theme";
import { useTranslation } from "@/hooks/useTranslation";
import { useColors } from "@/hooks/useColors";
import { getCurrentUser, signOut, isAuthenticated } from "@/services/auth";
import { uploadToCloud, downloadFromCloud, syncData } from "@/services/sync";
import type { AuthUser } from "@/services/auth";

export default function SyncSettings() {
    const { t } = useTranslation();
    const colors = useColors();
    const database = useSQLiteContext();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Recarregar status de autenticação quando a tela recebe foco (ex: após login)
    useFocusEffect(
        useCallback(() => {
            checkAuthStatus();
        }, [])
    );

    const checkAuthStatus = async () => {
        try {
            setCheckingAuth(true);
            const authenticated = await isAuthenticated();
            if (authenticated) {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.error("Erro ao verificar autenticação:", error);
        } finally {
            setCheckingAuth(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                            setUser(null);
                            router.back();
                        } catch (error) {
                            console.error("Erro ao fazer logout:", error);
                            Alert.alert("Erro", "Não foi possível fazer logout.");
                        }
                    },
                },
            ]
        );
    };

    const handleUpload = async () => {
        if (!user) {
            Alert.alert("Erro", "Você precisa estar autenticado para sincronizar.");
            router.push("/settings/sync/auth");
            return;
        }

        try {
            setSyncing(true);
            const result = await uploadToCloud(database);

            if (result.success) {
                Alert.alert(
                    "Sucesso",
                    "Dados enviados para a nuvem com sucesso!",
                    [{ text: "OK" }]
                );
            }
        } catch (error: any) {
            console.error("Erro ao fazer upload:", error);
            Alert.alert(
                "Erro",
                error.message || "Não foi possível enviar os dados para a nuvem."
            );
        } finally {
            setSyncing(false);
        }
    };

    const handleDownload = async () => {
        if (!user) {
            Alert.alert("Erro", "Você precisa estar autenticado para sincronizar.");
            router.push("/settings/sync/auth");
            return;
        }

        try {
            setSyncing(true);
            const result = await downloadFromCloud(database);

            if (result.success) {
                // Navegar de volta para a tela principal para forçar atualização da UI
                Alert.alert(
                    "Sucesso",
                    "Dados baixados da nuvem com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Navegar para a tela principal para forçar refresh
                                router.replace("/");
                            }
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error("Erro ao fazer download:", error);
            Alert.alert(
                "Erro",
                error.message || "Não foi possível baixar os dados da nuvem."
            );
        } finally {
            setSyncing(false);
        }
    };

    const handleSync = async () => {
        if (!user) {
            Alert.alert("Erro", "Você precisa estar autenticado para sincronizar.");
            router.push("/settings/sync/auth");
            return;
        }

        try {
            setSyncing(true);

            // Primeiro fazer upload
            const uploadResult = await uploadToCloud(database);

            // Depois fazer download
            const downloadResult = await downloadFromCloud(database);

            const allConflicts = [...uploadResult.conflicts, ...downloadResult.conflicts];

            if (allConflicts.length > 0) {
                // Navegar para tela de resolução de conflitos
                router.push({
                    pathname: "/settings/sync/conflicts",
                    params: {
                        conflicts: JSON.stringify(allConflicts),
                    },
                });
            } else {
                Alert.alert(
                    "Sucesso",
                    "Sincronização concluída com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Navegar para a tela principal para forçar refresh
                                router.replace("/");
                            }
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error("Erro na sincronização:", error);
            Alert.alert(
                "Erro",
                error.message || "Não foi possível sincronizar os dados."
            );
        } finally {
            setSyncing(false);
        }
    };

    if (checkingAuth) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.text.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Header transparent />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Heading fontSize="LARGE" style={styles.heading}>
                        Sincronização
                    </Heading>

                    <Title color="SECONDARY" style={styles.description}>
                        Sincronize seus dados com a nuvem para acessá-los em qualquer dispositivo.
                    </Title>
                </View>

                {!user ? (
                    <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
                        <View style={{ alignItems: 'center', gap: 8 }}>
                            <UserSwitchIcon
                                size={80}
                            />

                            <Text style={styles.sectionDescription}>
                                Você precisa criar uma conta ou fazer login para sincronizar seus dados.
                            </Text>
                        </View>

                        <PrimaryButton
                            label="Criar conta ou fazer login"
                            onPress={() => router.push("/settings/sync/auth")}
                        />
                    </View>
                ) : (
                    <>
                        <View
                            style={[
                                styles.sectionCard,
                                {
                                    backgroundColor: colors.background.secondary,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <View style={styles.userInfo}>
                                <Title fontSize="LARGE">
                                    Conectado como
                                </Title>

                                <Description>
                                    {user.email || "Usuário"}
                                </Description>
                            </View>

                            <TouchableOpacity onPress={handleSignOut}>
                                <SignOutIcon color="red" />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.section2,
                                { backgroundColor: colors.background.secondary }
                            ]}
                        >
                            <View>
                                <Title fontSize="LARGE">
                                    Sincronização
                                </Title>

                                <Description style={styles.sectionDescription}>
                                    Escolha como deseja sincronizar seus dados:
                                </Description>
                            </View>

                            <PrimaryButton
                                label="Enviar para nuvem"
                                Icon={CloudArrowUpIcon}
                                onPress={handleUpload}
                                disabled={syncing}
                            />

                            <PrimaryButton
                                label="Baixar da nuvem"
                                Icon={CloudArrowDownIcon}
                                onPress={handleDownload}
                                disabled={syncing}
                            />

                            {/* 
                                <PrimaryButton
                                    label="Sincronizar (Bidirecional)"
                                    Icon={ArrowsClockwiseIcon}
                                    onPress={handleSync}
                                    disabled={syncing}
                                />*/}

                            {syncing && (
                                <View style={styles.syncingContainer}>
                                    <ActivityIndicator size="small" color={colors.text.primary} />
                                    <Text style={[styles.syncingText, { color: colors.text.secondary }]}>
                                        Sincronizando...
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    section: {
        alignItems: 'center',
        borderRadius: 12,
        gap: 8,
        padding: 16,

        marginBottom: 24,
    },
    section2: {
        borderRadius: 12,
        gap: 8,
        padding: 16,
        marginBottom: 24,
    },
    sectionCard: {
        borderRadius: 12,
        gap: 8,
        padding: 16,
        marginBottom: 24,
    },
    sectionDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'center'
    },
    userInfo: {
        flex: 1
    },
    buttonGroup: {
        flex: 1,
        gap: 12,
    },
    syncingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        gap: 8,
    },
    syncingText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
    },
});

