import { View, Text, ColorValue } from "react-native";
import { IconButton } from "../IconButton";
import { ArrowLeftIcon } from "phosphor-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { Title } from "../Text/Title";
import { ReactNode } from "react";
import { colors } from "@/theme";

type Props = {
    children?: ReactNode;
    label?: string;
    transparent?: boolean;
}

export function Header({ children, label, transparent = false }: Props) {

    const insets = useSafeAreaInsets();

    return (
        <View 
            style={[
                styles.container, 
                { 
                    marginTop: insets.top,
                    backgroundColor: transparent ? 'transparent' : colors.background.primary
                }
            ]}
        >
            <IconButton
                Icon={ArrowLeftIcon}
                IconWeight="bold"
                onPress={() => router.back()}
            />

            {label &&
                <Title fontWeight="SEMIBOLD">
                    {label}
                </Title>
            }

            <View style={{ width: 40 }}>
                {children}
            </View>
        </View>
    );
}
