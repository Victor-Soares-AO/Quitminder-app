import { View, Text } from "react-native";
import { GlassView } from "expo-glass-effect";

import { styles } from "./styles";
import { Title } from "@/components/Text/Title";
import { Heading } from "@/components/Text/Heading";
import { colors } from "@/theme";

export function UpgradePlan() {
    return (
        <GlassView
            isInteractive
            glassEffectStyle="regular"
            style={styles.container}
        >
            <Heading color={colors.white} fontSize="LARGE">
                Quitminder Pro
            </Heading>

            <Title>
                Acesso ilimitado a todas os recursos
            </Title>
        </GlassView>
    )
}