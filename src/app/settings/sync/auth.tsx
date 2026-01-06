import { useState } from "react";
import { StyleSheet, ScrollView, View, Alert, TextInput, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeSlashIcon, X } from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconButton } from "@/components/IconButton";

import { colors, fontFamily } from "@/theme";
import { useTranslation } from "@/hooks/useTranslation";
import { useColors } from "@/hooks/useColors";
import { signUp, signIn } from "@/services/auth";

export default function AuthScreen() {
    const { t } = useTranslation();
    const colors = useColors();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);
            
            if (isLogin) {
                const { user, error } = await signIn(email.trim(), password);
                
                if (error) {
                    Alert.alert("Erro", error.message || "Não foi possível fazer login.");
                    return;
                }
                
                if (user) {
                    // Voltar sem alerta para melhor UX
                    router.back();
                }
            } else {
                const { user, error } = await signUp(email.trim(), password);
                
                if (error) {
                    Alert.alert("Erro", error.message || "Não foi possível criar a conta.");
                    return;
                }
                
                if (user) {
                    // Voltar sem alerta para melhor UX
                    router.back();
                }
            }
        } catch (error: any) {
            console.error("Erro na autenticação:", error);
            Alert.alert("Erro", error.message || "Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Header transparent/>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Heading fontSize="LARGE" style={styles.heading}>
                        {isLogin ? "Fazer Login" : "Criar Conta"}
                    </Heading>

                    <Title color="SECONDARY" style={styles.description}>
                        {isLogin 
                            ? "Entre com sua conta para sincronizar seus dados."
                            : "Crie uma conta para começar a sincronizar seus dados na nuvem."
                        }
                    </Title>
                </View>

                <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
                    <View style={styles.inputGroup}>
                        <Title style={styles.label}>
                            Email
                        </Title>
                        
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.background.primary,
                                color: colors.text.primary,
                                borderColor: colors.gray[300]
                            }]}
                            placeholder="seu@email.com"
                            placeholderTextColor={colors.gray[400]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Title fontSize="SMALL" style={styles.label}>
                            Senha
                        </Title>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.passwordInput, { 
                                    backgroundColor: colors.background.primary,
                                    color: colors.text.primary,
                                    borderColor: colors.gray[300]
                                }]}
                                placeholder="Sua senha"
                                placeholderTextColor={colors.gray[400]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete={isLogin ? "password" : "password-new"}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon size={20} color={colors.text.secondary} />
                                ) : (
                                    <EyeIcon size={20} color={colors.text.secondary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <PrimaryButton
                        label={isLogin ? "Entrar" : "Criar Conta"}
                        onPress={handleSubmit}
                        disabled={loading}
                    />

                    <TouchableOpacity
                        onPress={() => setIsLogin(!isLogin)}
                        disabled={loading}
                        style={styles.switchAuth}
                    >
                        <Text style={[styles.switchAuthText, { color: colors.text.secondary }]}>
                            {isLogin 
                                ? "Não tem uma conta? Criar conta"
                                : "Já tem uma conta? Fazer login"
                            }
                        </Text>
                    </TouchableOpacity>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={colors.text.primary} />
                        </View>
                    )}
                </View>
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
    section: {
        borderRadius: 12,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderRadius: 12,
        fontSize: 16,
        padding: 16,
        fontFamily: fontFamily.medium,
        borderWidth: 1,
    },
    passwordContainer: {
        position: "relative",
    },
    passwordInput: {
        height: 56,
        borderRadius: 12,
        fontSize: 16,
        padding: 16,
        paddingRight: 50,
        fontFamily: fontFamily.medium,
        borderWidth: 1,
    },
    eyeButton: {
        position: "absolute",
        right: 16,
        top: 18,
        padding: 4,
    },
    switchAuth: {
        marginTop: 16,
        alignItems: "center",
    },
    switchAuthText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
    },
    loadingContainer: {
        marginTop: 16,
        alignItems: "center",
    },
});

