import { fontFamily, colors } from "@/theme";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
    fontSize?: 'NORMAL' | 'LARGE';
    color?: string;
    children: React.ReactNode;
}

export function Heading({ children, fontSize = 'NORMAL', color = colors.text.primary }: Props) {
    return (
        <Text
            style={{
                fontSize: fontSize === 'NORMAL' ? 20 : 24,
                lineHeight: fontSize === 'NORMAL' ? 30 : 32,
                fontFamily: fontFamily.semibold,
                color: color
            }}
        >
            {children}
        </Text>
    )
}