import { Text, TextProps } from "react-native";

import { colors, fontFamily } from "@/theme";

type Props = TextProps & {
    color?: 'PRIMARY' | 'SECONDARY';
    fontSize?: 'NORMAL' | 'LARGE';
    fontWeight?: 'MEDIUM' | 'SEMIBOLD';
    children: React.ReactNode;
}

export function Title({ 
    children, 
    fontSize = 'NORMAL', 
    color = 'PRIMARY',
    fontWeight = 'MEDIUM'
}: Props) {

    return (
        <Text
            style={{
                fontSize: fontSize === 'NORMAL' ? 16 : 18,
                lineHeight: fontSize === 'NORMAL' ? 24 : 27,
                fontFamily: fontWeight === 'MEDIUM' ? fontFamily.medium : fontFamily.semibold,
                color: color === 'PRIMARY' ? colors.text.primary : colors.text.secondary
            }}
        >
            {children}
        </Text>
    )
}