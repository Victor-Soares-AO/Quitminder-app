import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FingerprintIcon, LockIcon } from "phosphor-react-native";
import { usePrivacyLock } from "@/contexts/PrivacyLockContext";
import { useColors } from "@/hooks/useColors";
import { Heading } from "@/components/Text/Heading";
import { useTranslation } from "@/hooks/useTranslation";
import { fontFamily } from "@/theme";

export default function LockScreen() {
    const { authenticate, checkBiometricSupport } = usePrivacyLock();
    const colors = useColors();
    const { t } = useTranslation();
    const [biometricSupported, setBiometricSupported] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        checkBiometricSupport().then(setBiometricSupported);
        // Tentar autenticar automaticamente quando a tela carrega
        handleAuthenticate();
    }, []);

    const handleAuthenticate = async () => {
        if (isAuthenticating) return;

        setIsAuthenticating(true);
        try {
            const success = await authenticate();
            if (!success) {
                // Não mostrar erro, apenas tentar novamente quando o usuário clicar
            }
        } catch (error) {
            console.error("Erro na autenticação:", error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background.primary,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.background.secondary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
        },
        textWrapper: {
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 24,
            fontFamily: "Inter-SemiBold",
            color: colors.text.primary,
            textAlign: "center",
        },
        description: {
            fontSize: 16,
            fontFamily: fontFamily.medium,
            color: colors.text.secondary,
            textAlign: "center"
        },
        button: {
            backgroundColor: colors.text.primary,
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 12,
            minWidth: 200,
            marginTop: 40,
        },
        buttonText: {
            color: colors.white,
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
            textAlign: "center",
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.iconContainer}>
                {biometricSupported ? (
                    <FingerprintIcon size={64} color={colors.text.primary} weight="fill" />
                ) : (
                    <LockIcon size={64} color={colors.text.primary} weight="fill" />
                )}
            </View>

            <View style={styles.textWrapper}>
                <Heading fontSize="LARGE" style={styles.title}>
                    {t("privacyLock.title")}
                </Heading>

                <Text style={styles.description}>
                    {biometricSupported
                        ? t("privacyLock.descriptionBiometric")
                        : t("privacyLock.descriptionPin")}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleAuthenticate}
                disabled={isAuthenticating}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    {isAuthenticating ? t("privacyLock.authenticating") : t("privacyLock.unlock")}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

