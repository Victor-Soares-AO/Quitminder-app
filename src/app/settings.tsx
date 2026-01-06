import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { router } from "expo-router";

import { BellIcon, LockKeyIcon, CloudIcon } from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";

import { SettingsButton } from "@/components/Button/SettingsButton";

import { colors } from "@/theme";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrivacyLock } from "@/contexts/PrivacyLockContext";

export default function Settings() {
    const { t } = useTranslation();
    const { isEnabled: privacyLockEnabled, setIsEnabled: setPrivacyLockEnabled, checkBiometricSupport } = usePrivacyLock();
    const [biometricSupported, setBiometricSupported] = useState(false);

    useEffect(() => {
        checkBiometricSupport().then(setBiometricSupported);
    }, []);

    const handlePrivacyLockToggle = async (value: boolean) => {
        if (value && !biometricSupported) {
            Alert.alert(
                t("privacyLock.notSupported"),
                t("privacyLock.notSupportedMessage"),
                [{ text: t("common.close") }]
            );
            return;
        }

        try {
            await setPrivacyLockEnabled(value);
        } catch (error) {
            console.error("Erro ao alterar bloqueio:", error);
            Alert.alert(t("common.error"), t("privacyLock.error"));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header transparent />
            <ScrollView style={styles.container}>
                <Heading fontSize="LARGE">
                    {t("settings.title")}
                </Heading>

                <View style={styles.group}>
                    <SettingsButton
                        label={t("settings.notifications")}
                        Icon={BellIcon}
                        iconWeight="fill"
                        onPress={() => router.push("/settings/notifications")}
                    />

                    <SettingsButton
                        label={t("settings.privacyLock")}
                        Icon={LockKeyIcon}
                        iconWeight="fill"
                        isSwitch={privacyLockEnabled}
                        onPress={() => handlePrivacyLockToggle(!privacyLockEnabled)}
                    />

                    <SettingsButton
                        label="Sincronização"
                        Icon={CloudIcon}
                        iconWeight="fill"
                        onPress={() => router.push("/settings/sync")}
                    />
                </View>

                {/*

                

            <View style={styles.group}>
                
                <SettingButton
                    title="Tip Jar"
                    Icon={Heart}
                    backgroundColor="#FF453A"
                    rounded="bottom"
                />
            </View>

            <View style={styles.group}>
                <SettingButton
                    title="Rate the App"
                    Icon={Star}
                    backgroundColor="#FF9F0A"
                    rounded="top"
                />
                <SettingButton
                    title="Share with a friend"
                    Icon={Export}
                    iconWeight="bold"
                    backgroundColor="#0A84FF"
                    rounded="bottom"
                />
            </View>

            <View style={styles.infoWrapper}>
                <Text style={styles.info}>
                    QuitMinder
                </Text>
                <Text style={styles.info}>
                    Made with ❤️ in Angola
                </Text>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingTop: 80
    },
    group: {
        gap: 24,
        marginTop: 24
    },
})