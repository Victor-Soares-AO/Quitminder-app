import { View, Text, TouchableOpacity } from "react-native";
import { CaretUpDownIcon } from "phosphor-react-native";

import { styles } from "./styles";
import { colors } from "@/theme";

type Props = {
    amount: number;
}

export function Highlight({ amount }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.habits}>
                    {amount}
                </Text>

                <Text style={styles.habits}>
                    Bad habit{amount > 1 && <Text style={styles.habits}>s</Text>}
                </Text>
            </View>

            {amount > 1 &&
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.wrapper}
                >
                    <Text style={styles.label}>
                        Abstinence
                    </Text>

                    <CaretUpDownIcon
                        size={16}
                        color={colors.gray[400]}
                        weight="bold"
                    />
                </TouchableOpacity>
            }
        </View>
    )
}