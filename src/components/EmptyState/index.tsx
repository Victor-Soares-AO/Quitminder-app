import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { colors, fontFamily } from "@/theme";
import { Description } from "@/components/Text/Description";

type Props = {
    title: string;
    message?: string;
    compact?: boolean;
};

export function EmptyState({ title, message, compact = false }: Props) {
    const colorsTheme = useColors();

    const styles = StyleSheet.create({
        container: {
            flex: compact ? 0 : 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: compact ? 32 : 64,
            paddingHorizontal: 32,
        },
        title: {
            fontSize: 16,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            textAlign: "center",
            marginBottom: 8,
            lineHeight: 24,
        },
        message: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            textAlign: "center",
            lineHeight: 20,
            maxWidth: 280,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            {message && (
                <Text style={styles.message}>
                    {message}
                </Text>
            )}
        </View>
    );
}

