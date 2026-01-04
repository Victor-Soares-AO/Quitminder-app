import React, { Suspense, useState, ReactNode } from "react";

import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";

import { Loading } from "@/components/Loading";

import { migrate } from "@/database/migrations/migrate";

import { HabitProvider } from "@/contexts/HabitContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider, useThemeContext } from "@/contexts/ThemeContext";
import { PrivacyLockProvider, usePrivacyLock } from "@/contexts/PrivacyLockContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/theme/getColors";
import LockScreen from "./lock";
import { useNotificationsInit } from "@/hooks/useNotificationsInit";

function RootLayoutContent() {
    const { isDark } = useThemeContext();
    const { isLocked } = usePrivacyLock();
    const colors = getColors(isDark);
    
    // Inicializar notificações quando o app abre
    useNotificationsInit();

    // Se estiver bloqueado, mostrar tela de bloqueio
    if (isLocked) {
        return <LockScreen />;
    }

    return (
        <HabitProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background.primary
                    },
                }}
            >
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="index" />
                <Stack.Screen name="edit-habit/[id]" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="create-habit"
                    options={{
                        presentation: 'pageSheet',
                        headerShown: false
                    }}
                />
                <Stack.Screen name="settings" />
            </Stack>
        </HabitProvider>
    );
}

function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <PrivacyLockProvider>
                    {children}
                </PrivacyLockProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    })

    if (!fontsLoaded) {
        return <Loading />
    }

    return (
        <Suspense fallback={<Loading />}>
            <SQLiteProvider
                databaseName="quitminder.db"
                onInit={migrate}
                useSuspense
            >
                <AppProviders>
                    <RootLayoutContent />
                </AppProviders>
            </SQLiteProvider>
        </Suspense>
    )
}