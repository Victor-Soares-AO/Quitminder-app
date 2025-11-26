import { View, Text, TouchableOpacity } from "react-native";
import { CaretUpDownIcon } from "phosphor-react-native";

import { styles } from "./styles";
import { colors } from "@/theme";
import { Heading } from "../Text/Heading";

type Props = {
    amount: number;
}

export function Highlight({ amount }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Heading>
                    {amount}
                </Heading>

                {amount == 1
                    ? <Heading>Mau Hábito</Heading>
                    : <Heading>Maus Hábitos</Heading>
                }
            </View>

            {/* {amount > 1 &&
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.wrapper}
                >
                    <Text style={styles.label}>
                        Abstinência
                    </Text>

                    <CaretUpDownIcon
                        size={16}
                        color={colors.gray[400]}
                        weight="bold"
                    />
                </TouchableOpacity>
            } */}
        </View>
    )
}