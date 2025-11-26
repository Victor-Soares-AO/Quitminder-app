import { fontFamily } from "@/theme";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
    fontSize?: 'NORMAL' | 'LARGE';
    // weight: 'medium' | 'semibold';
    children: React.ReactNode;
}

export function Heading({ children, fontSize = 'NORMAL' }: Props) {
    return (
        <Text
            style={{
                fontSize: fontSize === 'NORMAL' ? 20 : 24,
                lineHeight: fontSize === 'NORMAL' ? 30 : 32,
                fontFamily: fontFamily.semibold
            }}
        >
            {children}
        </Text>
    )
}