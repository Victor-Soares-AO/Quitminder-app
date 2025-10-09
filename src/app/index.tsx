import { View, Text, Alert, Button } from "react-native";
import { Plus } from "phosphor-react-native";
import Modal from 'react-native-modal';

import { List } from "@/components/List";
import { Empty } from "@/components/Empty";
import { HomeHeader } from "@/components/HomeHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";
import { HeaderGradient } from "@/components/HeaderGradient";
import { HabitCard } from "@/components/HabitCard";
import { Highlight } from "@/components/Highlight";

import { colors } from "@/theme";
import { Link, router } from "expo-router";
import { useState } from "react";

const habits = [
    { name: "Fast Food" },
    { name: "Gambling" },
    { name: "Implusive Shopping" }
]

export default function Index() {

    const [isModalVisible, setModalVisible] = useState(true);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: colors.background.primary, zIndex: -50 }}>
                <List
                    // bounces={false}
                    data={habits}
                    keyExtractor={(item) => item.name.toString()}
                    renderItem={({ item }) => (
                        <HabitCard 
                            title={item.name} 
                            onPress={() => router.navigate('/(tabs)/overview/1')} 
                        />
                    )}
                    contentContainerStyle={{
                        // flex: 1,
                        flexGrow: 1,
                        paddingBottom: 40,
                        backgroundColor: colors.background.primary,
                    }}
                    ListHeaderComponent={
                        <View style={{ paddingTop: 80 }}>
                            <HeaderGradient />
                            <HomeHeader />
                            <QuoteOfTheDay />
                            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                                <PrimaryButton
                                    onPress={() => router.navigate('/create-habit')}
                                    Icon={Plus}
                                    title="Add New"
                                />
                            </View>

                            {habits.length > 0 && <Highlight amount={habits.length} />}
                        </View>
                    }
                    ListEmptyComponent={<Empty />}
                />

                {/* <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 48,
                    zIndex: -40,
                    width: '100%'
                }}
            >
                <Text style={{ fontSize: 16, color: colors.gray[400] }}>
                    Stop scrolling, you aren't on TikTok :-(
                </Text>
            </View> */}
            </View>
        </>
    )
}