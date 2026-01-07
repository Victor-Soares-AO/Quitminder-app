import { router } from "expo-router";
import { View, Text } from "react-native";

import { BookBookmarkIcon, NutIcon } from "phosphor-react-native";

import { IconButton } from "@/components/IconButton";

import { styles } from "./styles";

export function HomeHeader() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                QuitMinder
            </Text>


            <View style={styles.wrapper}>
                <IconButton
                    Icon={BookBookmarkIcon}
                    IconWeight="fill"
                    onPress={() => router.navigate('/settings')}
                />

                <IconButton
                    Icon={NutIcon}
                    IconWeight="fill"
                    onPress={() => router.navigate('/settings')}
                />
            </View>
        </View>
    )
}