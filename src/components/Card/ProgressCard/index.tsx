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
    backgroundColor?: string;
}

export function ProgressCard({title, value, Icon, iconWeight, backgroundColor}:Props) {
    return (
        <View style={styles.container}>
            <View style={[styles.icon, backgroundColor && {backgroundColor}]}>
                <Icon 
                    size={20} 
                    weight={iconWeight} 
                    color={backgroundColor ? "#FFF" : colors.gray[700]} 
                />
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