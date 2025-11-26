import { router } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { InfinityIconIcon, LightningIcon, LockKeyIcon, X } from "phosphor-react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IconButton } from "@/components/IconButton";
import { OnboardingCard } from "@/components/OnboardingCard";
import { PrimaryButton } from "@/components/PrimaryButton";

import { colors, fontFamily } from "@/theme";
import { ONBOARDING_COLLECTION } from "@/storage/storageConfig";

export default function Onboarding() {

    const insets = useSafeAreaInsets();

    const handleCloseOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_COLLECTION, 'true');
            router.navigate('/'); 
        } catch (error) {
            console.error("Erro ao salvar o status do Onboarding:", error);
            router.navigate('/');
        }
    };

    return (
        <>
            <ScrollView style={[styles.container, { paddingTop: insets.top + 24 }]}>
                <View style={styles.header}>
                    <IconButton
                        Icon={X}
                        iconWeight="bold"
                        onPress={handleCloseOnboarding}
                    />
                </View>

                <View style={styles.icon} />

                <View style={styles.textWrapper}>
                    <Text style={styles.heading}>
                        QuitMinder
                    </Text>

                    <Text style={styles.description}>
                        Seu espaço seguro para abandonar{'\n'} maus hábitos aos poucos.
                    </Text>
                </View>

                <View>
                    <OnboardingCard
                        Icon={InfinityIconIcon}
                        iconWeight="bold"
                        backgroundColor="#0A9956"
                        heading="Retome o controle"
                        description="Adicione os maus hábitos e veja há quanto tempo você está livre deles."
                    />

                    <OnboardingCard
                        Icon={LightningIcon}
                        iconWeight="fill"
                        backgroundColor="#FF9300"
                        heading="Defina seu propósito"
                        description="Escreva suas razões pessoais e receba motivação quando precisar."
                    />

                    <OnboardingCard
                        Icon={LockKeyIcon}
                        iconWeight="fill"
                        backgroundColor="#007AFF"
                        heading="Proteja sua privacidade"
                        description="Bloqueie o app com Face ID e mantenha tudo sob o seu controle."
                    />
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                <PrimaryButton
                    label="Vamos Começar"
                    onPress={handleCloseOnboarding}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    header: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    icon: {
        height: 88,
        width: 88,
        borderRadius: 12,
        backgroundColor: '#F5F5F7',
        alignSelf: 'center'
    },
    textWrapper: {
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 32
    },
    heading: {
        fontSize: 24,
        fontFamily: fontFamily.semibold,
    },
    description: {
        fontSize: 16,
        fontFamily: fontFamily.medium,
        textAlign: 'center',
        lineHeight: 24,
        color: colors.text.secondary
    },
    footer: {
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 16,
    }
});