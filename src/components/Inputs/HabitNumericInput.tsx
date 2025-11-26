import React from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import { IconProps, IconWeight } from "phosphor-react-native";
import { colors, fontFamily } from "@/theme";

type Props = {
    title: string;
    value?: string;
    Icon: React.FC<IconProps>;
    iconWeight?: IconWeight;
    rounded?: "top" | "bottom" | "full";
    onChangeText: (text: string) => void;
};

export function HabitNumericInput({
    title,
    value = "",
    Icon,
    iconWeight = "fill",
    rounded,
    onChangeText,
}: Props) {
    return (
        <View
            style={[
                styles.container,
                rounded === "full" && { borderRadius: 16 },
                rounded === "top" && {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                },
                rounded === "bottom" && {
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                },
            ]}
        >
            <Icon color={colors.gray[1000]} size={28} weight={iconWeight} />

            <Text style={styles.title}>{title}</Text>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                // keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.gray[400]}

                keyboardType="decimal-pad"
                returnKeyType="done"
                // onSubmitEditing={Keyboard.dismiss}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 16,
        backgroundColor: colors.background.secondary,
    },
    title: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
        marginLeft: 12,
    },
    input: {
        flex: 1,
        textAlign: "right",
        fontSize: 16,
        fontFamily: fontFamily.medium,
        color: colors.text.primary,
    },
});
