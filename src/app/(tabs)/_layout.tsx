import { Tabs } from "expo-router";
import {
    CalendarBlankIcon,
    ChartBarIcon,
    SquaresFourIcon
} from "phosphor-react-native";

import { Calendar, ChartNoAxesColumnIncreasing, LayoutGrid } from "lucide-react-native";

import { colors, fontFamily } from "@/theme";

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
                        borderTopWidth: 1.75,
                        borderTopColor: '#F1F1F1'
                    },
                    tabBarIconStyle: {
                        marginBottom: 2,
                    },
                    tabBarLabelStyle: {
                        fontFamily: fontFamily.semibold,
                        fontSize: 11
                    }
                }}
            >
                <Tabs.Screen
                    name="overview/[id]"
                    options={{
                        title: "Visão Geral",
                        tabBarIcon: ({ color }) => (
                            <LayoutGrid
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="statistic"
                    options={{
                        title: "Estatística",
                        tabBarIcon: ({ color }) => (
                            <ChartNoAxesColumnIncreasing
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="calendar"
                    options={{
                        title: "Calendário",
                        tabBarIcon: ({ color }) => (
                            <Calendar
                                size={24}
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
                    name="overview/diary/create"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />

                <Tabs.Screen
                    name="overview/diary/[id]"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />

                <Tabs.Screen
                    name="overview/affirmations"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />

                <Tabs.Screen
                    name="overview/journey-analysis"
                    options={{ href: null, tabBarStyle: { display: "none" } }}
                />
            </Tabs>
    );
}
