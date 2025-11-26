import { Alert, StyleSheet, ScrollView } from "react-native";

import { MoonIcon, X } from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { Heading } from "@/components/Text/Heading";
import { SettingButton } from "@/components/SettingButton";

import { colors } from "@/theme";

export default function Settings() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <ScrollView style={styles.container}>
                <Heading fontSize="LARGE">
                    Definições
                </Heading>

                <SettingButton
                    title="Modo Escuro"
                    Icon={MoonIcon}
                    backgroundColor="#3A3A3C"
                    rounded="full"
                    isSwitch
                />

                <SettingButton
                    title="Apagar Banco de Dados"
                    Icon={X}
                    backgroundColor="#FF3B30"
                    rounded="full"
                    onPress={() => Alert.alert('quitminder.db')}
                />

                {/* <View style={styles.group}>
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
            </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingTop: 80
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
    // title: {
    //     color: colors.text.primary,
    //     fontSize: 28,
    //     fontFamily: fontFamily.semibold
    // },
    // group: {
    //     marginBottom: 20
    // },
    // infoWrapper: {
    //     gap: 8,
    //     marginTop: 16,
    //     marginBottom: 64
    // },
    // info: {
    //     color: colors.gray[400],
    //     fontSize: 14,
    //     fontFamily: fontFamily.semibold,
    //     alignSelf: 'center'
    // }
})