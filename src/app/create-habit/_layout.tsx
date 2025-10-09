import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background.primary },
                headerTintColor: colors.white
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Add",
                    headerBackButtonMenuEnabled: false,
                    headerBackButtonDisplayMode: "minimal"
                }}
            />

            <Stack.Screen
                name="edit/[id]"
                options={{
                    title: "Edit"
                }}
            />
        </Stack>
    )
}