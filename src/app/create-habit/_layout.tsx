import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background.primary },
                headerTintColor: colors.text.primary
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Novo Hábito",
                    headerBackButtonMenuEnabled: false,
                    headerBackButtonDisplayMode: "minimal"
                }}
            />

            <Stack.Screen
                name="edit/[id]"
                options={{
                    title: "Editar"
                }}
            />
        </Stack>
    )
}