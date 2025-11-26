import React from 'react';
import { View, Text } from "react-native";

import { IconProps, IconWeight } from 'phosphor-react-native';

import { colors } from "@/theme";
import { Description } from '@/components/Text/Description';
import { Title } from '@/components/Text/Title';
import { styles } from './styles';

type Props = {
    title: string;
    value: string;
    Icon: React.FC<IconProps>;
    iconWeight?: IconWeight;
}

export function ProgressCard({title, value, Icon, iconWeight}:Props) {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Icon color={colors.gray[700]} size={20} weight={iconWeight} />
            </View>

            <View>
                <Description>
                    {title}
                </Description>

                <Title>
                    {value}
                </Title>
            </View>
        </View>
    )
}