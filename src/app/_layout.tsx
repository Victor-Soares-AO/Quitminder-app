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

export default function Layout(){

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    })

    if (!fontsLoaded) {
        return <Loading />
    }

    return(
        <Stack 
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.background.primary
                }
            }}
        />
    )
}