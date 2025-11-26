import { Tabs } from "expo-router";
import {
    Calendar,
    CalendarBlankIcon,
    CalendarDotsIcon,
    ChartBarIcon,
    ChatCenteredDotsIcon,
    Heart,
    House,
    SquaresFourIcon
} from "phosphor-react-native";

import { colors } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
    return (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.text.primary,
                    tabBarInactiveTintColor: colors.text.tertiary,
                    tabBarStyle: {
                        backgroundColor: colors.background.primary,
                        height: 88,
                        paddingTop: 8,
                        borderTopColor: colors.gray[100]
                    }
                }}
            >
                <Tabs.Screen
                    name="overview/[id]"
                    options={{
                        title: "Visão Geral",
                        tabBarIcon: ({ color, size }) => (
                            <SquaresFourIcon
                                weight="fill"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="statistic"
                    options={{
                        title: "Estatística",
                        tabBarIcon: ({ color, size }) => (
                            <ChartBarIcon
                                weight="fill"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="calendar"
                    options={{
                        title: "Calendário",
                        tabBarIcon: ({ color, size }) => (
                            <CalendarBlankIcon
                                weight="fill"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="overview/reasons"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />

                <Tabs.Screen
                    name="overview/diary"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />

                <Tabs.Screen
                    name="overview/affirmations"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />
            </Tabs>
    );
}
