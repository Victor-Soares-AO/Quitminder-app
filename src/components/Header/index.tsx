import { View, Text, ColorValue, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "../IconButton";
import { ArrowLeftIcon } from "phosphor-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title } from "../Text/Title";
import { ReactNode } from "react";
import { useColors } from "@/hooks/useColors";
import { ChevronLeft, X } from "lucide-react-native";

type Props = {
    children?: ReactNode;
    label?: string;
    transparent?: boolean;
    iconBGType?: "PRIMARY" | "SECONDARY";
    closeIcon?: boolean;
}

export function Header({ children, label, transparent = false, iconBGType = "PRIMARY", closeIcon = false }: Props) {
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
            paddingBottom: 4,
            paddingHorizontal: 16,
            zIndex: 10,
        },
    });

    return (
        <View style={[styles.container, { marginTop: insets.top }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 999,
                    width: 40,
                    height: 40,
                    paddingRight: closeIcon ? 0 : 2,
                    backgroundColor: iconBGType === "PRIMARY" ? colors.background.secondary : colors.background.primary
                }}
            >
                {closeIcon
                    ? <X color={colors.text.primary} />
                    : <ChevronLeft color={colors.text.primary} />
                }
            </TouchableOpacity>

            {label &&
                <Title fontWeight="SEMIBOLD">
                    {label}
                </Title>
            }

            <View>
                {children}
            </View>
        </View>
    );
}
