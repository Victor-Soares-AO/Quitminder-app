import React from "react";
import { Stack } from "expo-router";
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
} from "@expo-google-fonts/inter";

import { Loading } from "@/components/Loading";

import { colors } from "@/theme";
import { ClockUserIcon } from "phosphor-react-native";

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
        <React.Fragment>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background.primary
                    }
                }}
            >
                <Stack.Screen
                    name="index"
                />

                <Stack.Screen
                    name="(tabs)"
                />

                <Stack.Screen
                    name="create-habit"
                    options={{
                        presentation: 'pageSheet',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="settings"
                    options={{
                        presentation: 'pageSheet',
                        headerShown: false
                    }}
                />
            </Stack>
        </React.Fragment>
    )
}