import { View, Text } from "react-native";
import { styles } from "./styles";

import { SecondaryButton } from "../SecondaryButton";
import { GearSixIcon } from "phosphor-react-native";
import { UpgradeButton } from "@/components/UpgradeButton";
import { router } from "expo-router";

export function HomeHeader() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                QuitMinder
            </Text>


            <View style={styles.wrapper}>
                <UpgradeButton title="Upgrade" />

                <SecondaryButton 
                    Icon={GearSixIcon} 
                    onPress={() => router.navigate('/settings')}
                />
            </View>
        </View>
    )
}