import { SecondaryButton } from "@/components/SecondaryButton";
import { SettingButton } from "@/components/SettingButton";
import { colors, fontFamily } from "@/theme";
import { router } from "expo-router";
import { ScanFace } from "lucide-react-native";
import { Bell, ChatCircleIcon, Export, Hand, Heart, ListBulletsIcon, MoonIcon, Star, X } from "phosphor-react-native";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function Settings() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {/* <View style={{ width: 32 }} /> */}

                <Text style={styles.title}>
                    Settings
                </Text>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <X
                        size={16}
                        color="#FFF"
                        weight="bold"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.group}>
                <SettingButton
                    title="Dark Mode"
                    Icon={MoonIcon}
                    backgroundColor="#3A3A3C"
                    rounded="full"
                    isSwitch
                />
            </View>

            <View style={styles.group}>
                <SettingButton
                    title="Notifications"
                    Icon={Bell}
                    backgroundColor="#FF453A"
                    rounded="top"
                />
                <SettingButton
                    title="Privacy & Security"
                    Icon={Hand}
                    backgroundColor="#0A84FF"
                />
                <SettingButton
                    title="Unlock with Face ID"
                    Icon={ScanFace}
                    backgroundColor="#06BA21"
                    rounded="bottom"
                    isSwitch
                />
            </View>

            <View style={styles.group}>
                <SettingButton
                    title="Feedback"
                    Icon={ChatCircleIcon}
                    backgroundColor="#0A84FF"
                    rounded="top"
                />
                <SettingButton
                    title="Development Roadmap"
                    Icon={ListBulletsIcon}
                    iconWeight="bold"
                    backgroundColor="#3A3A3C"
                />
                <SettingButton
                    title="Tip Jar"
                    Icon={Heart}
                    backgroundColor="#FF453A"
                    rounded="bottom"
                />
            </View>

            <View style={styles.group}>
                <SettingButton
                    title="Rate the App"
                    Icon={Star}
                    backgroundColor="#FF9F0A"
                    rounded="top"
                />
                <SettingButton
                    title="Share with a friend"
                    Icon={Export}
                    iconWeight="bold"
                    backgroundColor="#0A84FF"
                    rounded="bottom"
                />
            </View>

            <View style={styles.infoWrapper}>
                <Text style={styles.info}>
                    QuitMinder
                </Text>
                <Text style={styles.info}>
                    Made with ❤️ in Angola
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingTop: 24
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    closeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.15)'
    },
    title: {
        color: colors.white,
        fontSize: 28,
        fontFamily: fontFamily.semibold
    },
    group: {
        marginBottom: 20
    },
    infoWrapper: {
        gap: 8,
        marginTop: 16,
        marginBottom: 64
    },
    info: {
        color: colors.gray[400],
        fontSize: 14,
        fontFamily: fontFamily.semibold,
        alignSelf: 'center'
    }
})