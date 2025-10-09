import { Tabs } from "expo-router";
import {
    CalendarDotsIcon,
    ChartBarIcon,
    ChatCenteredDotsIcon,
    House
} from "phosphor-react-native";

import { colors } from "@/theme";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: colors.gray[900],
                tabBarStyle: {
                    backgroundColor: colors.background.primary,
                    height: 88,
                    paddingTop: 8,
                    borderTopColor: "#38383A"
                }
            }}
        >
            <Tabs.Screen
                name="overview/[id]"
                options={{
                    title: "Overview",
                    tabBarIcon: ({ color, size }) => (
                        <House
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
                    title: "Statistic",
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
                    title: "Calendar",
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDotsIcon
                            weight="fill"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat AI",
                    tabBarIcon: ({ color, size }) => (
                        <ChatCenteredDotsIcon
                            weight="fill"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="reasons"
                options={{
                    href: null,
                    title: "Hidden",
                }}
            />
        </Tabs>
    );
}
