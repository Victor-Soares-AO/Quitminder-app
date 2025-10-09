import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, Button } from "react-native";
// import { Sparkle } from "phosphor-react-native";
// import { Sparkles } from "react-native-heroicons";
// import { Sparkles } from "react-native-heroicons";
// import * as Icons from "react-native-heroicons/solid";
import SparklesIcon from "@/assets/sparkles.svg"

import { Sparkles } from "react-native-heroicons";

import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string;
}

export function UpgradeButton({ title }: Props) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container}>
            {/* <SparklesIcon /> */}

            {title && <Text style={styles.title}>{title}</Text>}
        </TouchableOpacity>
    )
}