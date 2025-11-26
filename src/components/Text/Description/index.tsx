import { Text, TextProps } from "react-native";

import { colors, fontFamily } from "@/theme";

type Props = TextProps & {
    color?: 'PRIMARY' | 'SECONDARY';
    fontSize?: 'NORMAL' | 'SMALL';
    fontWeight?: 'MEDIUM' | 'SEMIBOLD';
    children: React.ReactNode;
}

export function Description({ 
    children, 
    fontSize = 'NORMAL', 
    color = 'SECONDARY',
    fontWeight = 'MEDIUM'
}: Props) {

    return (
        <Text
            style={{
                fontSize: fontSize === 'NORMAL' ? 14 : 12,
                lineHeight: fontSize === 'NORMAL' ? 21 : 18,
                fontFamily: fontWeight === 'MEDIUM' ? fontFamily.medium : fontFamily.semibold,
                color: color === 'PRIMARY' ? colors.text.primary : colors.text.secondary
            }}
        >
            {children}
        </Text>
    )
}