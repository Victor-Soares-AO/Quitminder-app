import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";

import { colors } from "@/theme";
import { PencilSimpleIcon, Plus } from "phosphor-react-native";
import { useState } from "react";

export default function Edit() {

    const [name, setName] = useState("Custom Habit");

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity activeOpacity={0.8} style={styles.icon}>
                    <Plus
                        size={28}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor={colors.gray[400]}
                    style={styles.habitName}
                />

                {/* <View>
                    <PencilSimpleIcon

                    />
                </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingTop: 24
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 20
    },
    icon: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: '#3A3A3C',
        marginRight: 12
    },
    habitName: {
        flex: 1,
        fontSize: 20,
        color: colors.white
    }
});