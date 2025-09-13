import { HeaderGradient } from "@/components/HeaderGradient";
import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/theme";
import { View, Text, ScrollView } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background.primary
            }}
        >
            <HeaderGradient />
            <HomeHeader />

            {/* <View style={{paddingHorizontal: 16, marginTop: 16}}>
                <PrimaryButton title="Add New" />
            </View> */}

            {/* <List
                data={[1, 2, 3, 4, 5]}
                renderItem={() => <Text style={{ color: "#FFF" }}>Habit</Text>}
                keyExtractor={item => item.toString()}
                containerStyle={{ paddingHorizontal: 16 }}
            /> */}
        </View>
    )
}