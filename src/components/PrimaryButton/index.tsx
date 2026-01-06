import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from "react-native";
import { IconProps, IconWeight } from "phosphor-react-native";

import { styles as baseStyles } from "./styles";
import { useColors } from "@/hooks/useColors";
import { fontFamily } from "@/theme";

type Props = TouchableOpacityProps & {
    label: string;
    Icon?: React.FC<IconProps>;
    IconWeight?: IconWeight;
    backgroundColor?: string;
}

export function PrimaryButton({ label, Icon, IconWeight = "bold", backgroundColor, ...rest }: Props) {
    const colors = useColors();
    
    // Determinar a cor do fundo do botão
    const buttonBg = backgroundColor || colors.button.primary;
    
    // Determinar a cor do texto/ícone baseado no contraste
    // Modo claro: button.primary = "#262626" (escuro) -> texto = "#FEFFFF" (branco)
    // Modo escuro: button.primary = "#FEFFFF" (branco) -> texto = "#000000" (preto)
    let textColor: string;
    
    if (buttonBg === colors.button.primary) {
        // Botão padrão: usar contraste baseado no tema
        if (colors.button.primary === "#262626") {
            // Modo claro: botão escuro, texto branco
            textColor = colors.white;
        } else if (colors.button.primary === "#FEFFFF") {
            // Modo escuro: botão branco, texto preto
            textColor = colors.black;
        } else {
            // Fallback: usar cor de fundo primária (geralmente branco)
            textColor = colors.background.primary;
        }
    } else {
        // Botão customizado: calcular brilho para determinar contraste
        const hex = buttonBg.replace('#', '');
        if (hex.length === 6) {
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            textColor = brightness > 128 ? colors.black : colors.white;
        } else {
            // Fallback se não conseguir calcular
            textColor = colors.text.primary;
        }
    }

    const dynamicStyles = StyleSheet.create({
        container: {
            ...baseStyles.container,
            backgroundColor: buttonBg,
        },
        title: {
            fontSize: 16,
            fontFamily: fontFamily.semibold,
            color: textColor,
        },
    });

    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={dynamicStyles.container} 
            {...rest}
        >
            {Icon && <Icon color={textColor} size={18} weight={IconWeight} />}

            <Text style={dynamicStyles.title}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}