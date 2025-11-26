import { View, Text } from "react-native";
import { styles } from "./styles";

// import { SecondaryButton } from "../SecondaryButton";
import { GearFineIcon, GearSixIcon, NutIcon } from "phosphor-react-native";
import { UpgradeButton } from "@/components/UpgradeButton";
import { router } from "expo-router";
import { IconButton } from "../IconButton";

export function HomeHeader() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                QuitMinder
            </Text>


            <View style={styles.wrapper}>
                <UpgradeButton title="Ativar Pro" />

                <IconButton 
                    Icon={NutIcon} 
                    iconWeight="fill"
                    onPress={() => router.navigate('/settings')}
                />
            </View>
        </View>
    )
}