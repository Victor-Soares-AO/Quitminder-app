import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fontFamily } from "@/theme";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";

type Props = {
    title: string;
    headline?: string;
    subtext?: string;
    children: React.ReactNode;
};

export function ChartCard({ title, headline, subtext, children }: Props) {
    const colorsTheme = useColors();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colorsTheme.background.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
        },
        title: {
            fontSize: 14,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        headline: {
            fontSize: 18,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            lineHeight: 24,
            marginBottom: 8,
        },
        subtext: {
            fontSize: 13,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.secondary,
            lineHeight: 18,
            marginBottom: 16,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            
            {headline && (
                <Text style={styles.headline}>
                    {headline}
                </Text>
            )}
            
            {subtext && (
                <Text style={styles.subtext}>
                    {subtext}
                </Text>
            )}
            
            {children}
        </View>
    );
}

