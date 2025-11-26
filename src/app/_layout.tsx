import React, { Suspense, useState } from "react";

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

import { colors } from "@/theme";
import { migrate } from "@/database/migrations/migrate";

import { HabitProvider } from "@/contexts/HabitContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
            </SQLiteProvider>
        </Suspense>
    )
}