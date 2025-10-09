import { SecondaryButton } from "@/components/SecondaryButton";
import { SettingButton } from "@/components/SettingButton";
import { colors, fontFamily } from "@/theme";
import { Link, router } from "expo-router";
import { Brain } from "lucide-react-native";
import { Bell, HamburgerIcon, LightbulbIcon, PencilSimpleIcon, X } from "phosphor-react-native";
import { View, Text, StyleSheet } from "react-native";

export default function Overview() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SecondaryButton
                    Icon={X}
                    iconWeight="bold"
                    onPress={() => router.back()}
                />

                <Text style={styles.title}>
                    Overview
                </Text>

                <SecondaryButton
                    Icon={PencilSimpleIcon}
                    iconWeight="fill"
                />
            </View>

            <View style={styles.wrapper}>
                <View style={styles.habitInfoCard}>
                    <View style={styles.habitIcon}>
                        <HamburgerIcon
                            size={28}
                            color={colors.white}
                            weight="fill"
                        />
                    </View>

                    <View>
                        <Text style={styles.habitName}>
                            Fast Food
                        </Text>

                        <Text style={styles.startingDate}>
                            Starting in 21 August 2025
                        </Text>
                    </View>
                </View>

                <View style={styles.group}>
                    <Link href="reasons">
                        <SettingButton
                            Icon={LightbulbIcon}
                            title="Reasons to Quit"
                            backgroundColor="#0A84FF"
                            rounded="top"
                        // onPress={() => router.push('/reasons')}
                        />
                    </Link>

                    <SettingButton
                        Icon={Bell}
                        title="Notification"
                        backgroundColor="#FF453A"
                        rounded="bottom"
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary
    },
    wrapper: {
        marginHorizontal: 16,
        gap: 20
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 80,
        paddingBottom: 12,
        backgroundColor: colors.background.primary
    },
    title: {
        color: colors.white,
        fontSize: 18
    },
    startingDate: {
        color: colors.gray[400],
        fontSize: 14
    },
    habitInfoCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0055B2',
        borderRadius: 20,
        marginTop: 12,
    },
    habitIcon: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: '#0A84FF',
        marginRight: 12
    },
    habitName: {
        color: colors.white,
        fontSize: 18,
        fontFamily: fontFamily.medium,
        marginBottom: 4
    },
    group: {

    }
})