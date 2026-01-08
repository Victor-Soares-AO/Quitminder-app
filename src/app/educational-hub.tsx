import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { 
    BookOpenTextIcon, 
    PlayIcon, 
    ArticleIcon,
    HeadphonesIcon,
    ArrowLeftIcon
} from "phosphor-react-native";

import { Header } from "@/components/Header";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";
import { colors, fontFamily } from "@/theme";
import { useColors } from "@/hooks/useColors";
import { EDUCATIONAL_HUB, EducationalCategory, EducationalContent } from "@/data/educationalHub";
import { useTranslation } from "@/hooks/useTranslation";

export default function EducationalHub() {
    const insets = useSafeAreaInsets();
    const colorsTheme = useColors();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<EducationalCategory | null>(null);
    
    // Se houver parâmetro de categoria, abrir automaticamente
    useEffect(() => {
        if (params.category && !selectedCategory) {
            const category = EDUCATIONAL_HUB.find(cat => {
                // Mapear categorias de sugestão para categorias do hub
                const mapping: Record<string, string> = {
                    'temporal-emocional': 'emotional-triggers',
                    'social-comportamental': 'social-context',
                    'contextual-emocional': 'emotional-triggers',
                    'temporal-social': 'social-context',
                    'emocional-comportamental': 'impulsivity',
                    'alto-risco': 'self-control',
                    'temporal-dominante': 'support-routines',
                    'emocional-isolado': 'emotional-triggers'
                };
                return cat.id === mapping[params.category as string] || cat.id === params.category;
            });
            if (category) {
                setSelectedCategory(category);
            }
        }
    }, [params.category]);

    const getContentIcon = (type: EducationalContent['type']) => {
        switch (type) {
            case 'book':
                return BookOpenTextIcon;
            case 'video':
                return PlayIcon;
            case 'article':
                return ArticleIcon;
            case 'podcast':
                return HeadphonesIcon;
            default:
                return BookOpenTextIcon;
        }
    };

    const getContentTypeLabel = (type: EducationalContent['type']) => {
        switch (type) {
            case 'book':
                return 'Livro';
            case 'video':
                return 'Vídeo';
            case 'article':
                return 'Artigo';
            case 'podcast':
                return 'Podcast';
            default:
                return 'Conteúdo';
        }
    };

    const handleContentPress = async (content: EducationalContent) => {
        if (content.url) {
            try {
                const canOpen = await Linking.canOpenURL(content.url);
                if (canOpen) {
                    await Linking.openURL(content.url);
                } else {
                    console.warn('Não foi possível abrir a URL:', content.url);
                }
            } catch (error) {
                console.error('Erro ao abrir URL:', error);
            }
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorsTheme.background.primary,
        },
        content: {
            paddingHorizontal: 16,
            paddingVertical: 24,
        },
        header: {
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 28,
            fontFamily: fontFamily.bold,
            color: colorsTheme.text.primary,
            marginBottom: 8,
        },
        headerDescription: {
            fontSize: 16,
            fontFamily: fontFamily.regular,
            color: colorsTheme.text.secondary,
            lineHeight: 24,
        },
        categoryCard: {
            backgroundColor: colorsTheme.background.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
        },
        categoryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        categoryTitle: {
            fontSize: 18,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            flex: 1,
        },
        categoryDescription: {
            fontSize: 14,
            fontFamily: fontFamily.regular,
            color: colorsTheme.text.secondary,
            lineHeight: 20,
            marginBottom: 8,
        },
        categoryIntention: {
            fontSize: 12,
            fontFamily: fontFamily.medium,
            color: colorsTheme.gray[600],
            fontStyle: 'italic',
            marginBottom: 16,
        },
        contentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colorsTheme.background.primary,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
        },
        contentIcon: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: colorsTheme.gray[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        contentInfo: {
            flex: 1,
        },
        contentTitle: {
            fontSize: 16,
            fontFamily: fontFamily.semibold,
            color: colorsTheme.text.primary,
            marginBottom: 4,
        },
        contentMeta: {
            fontSize: 12,
            fontFamily: fontFamily.regular,
            color: colorsTheme.text.secondary,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        backButtonText: {
            fontSize: 16,
            fontFamily: fontFamily.medium,
            color: colorsTheme.text.primary,
            marginLeft: 8,
        },
    });

    if (selectedCategory) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Header transparent>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <ArrowLeftIcon size={24} color={colorsTheme.text.primary} weight="bold" />
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </Header>
                <ScrollView style={styles.content}>
                    <View style={styles.header}>
                        <Title fontWeight="SEMIBOLD" fontSize="LARGE">
                            {selectedCategory.label}
                        </Title>
                        <Description style={{ marginTop: 8 }}>
                            {selectedCategory.description}
                        </Description>
                        <Text style={styles.categoryIntention}>
                            {selectedCategory.intention}
                        </Text>
                    </View>

                    {selectedCategory.contents.map((content) => {
                        const IconComponent = getContentIcon(content.type);
                        return (
                            <TouchableOpacity
                                key={content.id}
                                style={styles.contentItem}
                                onPress={() => handleContentPress(content)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.contentIcon}>
                                    <IconComponent 
                                        size={20} 
                                        color={colorsTheme.gray[700]} 
                                        weight="fill" 
                                    />
                                </View>
                                <View style={styles.contentInfo}>
                                    <Text style={styles.contentTitle}>
                                        {content.title}
                                    </Text>
                                    <Text style={styles.contentMeta}>
                                        {getContentTypeLabel(content.type)}
                                        {content.author && ` • ${content.author}`}
                                        {content.duration && ` • ${content.duration}`}
                                    </Text>
                                    {content.description && (
                                        <Description style={{ marginTop: 4, fontSize: 13 }}>
                                            {content.description}
                                        </Description>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header />
            <ScrollView style={[styles.content, { marginTop: 60 }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Hub Educativo
                    </Text>
                    <Text style={styles.headerDescription}>
                        Conteúdos organizados por intenção para apoiar sua jornada de autoconsciência e mudança.
                    </Text>
                </View>

                {EDUCATIONAL_HUB.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => setSelectedCategory(category)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>
                                {category.label}
                            </Text>
                        </View>
                        <Text style={styles.categoryDescription}>
                            {category.description}
                        </Text>
                        <Text style={styles.categoryIntention}>
                            {category.intention}
                        </Text>
                        <Description>
                            {category.contents.length} {category.contents.length === 1 ? 'conteúdo' : 'conteúdos'} disponíveis
                        </Description>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

