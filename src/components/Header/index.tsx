import { View, Text, ColorValue, StyleSheet } from "react-native";
import { IconButton } from "../IconButton";
import { ArrowLeftIcon } from "phosphor-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title } from "../Text/Title";
import { ReactNode } from "react";
import { useColors } from "@/hooks/useColors";

type Props = {
    children?: ReactNode;
    label?: string;
    transparent?: boolean;
}

export function Header({ children, label, transparent = false }: Props) {
    const insets = useSafeAreaInsets();
    const colors = useColors();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: transparent ? 'transparent' : colors.background.primary,
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 16,
            paddingBottom: 4,
            paddingHorizontal: 16,
            zIndex: 10,
        },
    });

    return (
        <View 
            style={[
                styles.container, 
                { 
                    marginTop: insets.top,
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
