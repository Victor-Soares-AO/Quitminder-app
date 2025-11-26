import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import {
    PlusIcon,
    Trash,
    CalendarBlankIcon,
    CheckFatIcon,
} from "phosphor-react-native";
import { colors } from "@/theme";
import { useReasonDatabase } from "@/database/useReasonDatabase";
import { useHabit } from "@/contexts/useHabit";
import { formatDateToDayMonth } from "@/utils/formatDate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading } from "@/components/Text/Heading";
import { Title } from "@/components/Text/Title";
import { Description } from "@/components/Text/Description";

export default function Reasons() {

    const insets = useSafeAreaInsets();

    const { habit } = useHabit();
    const { create, listByHabit, update, remove } = useReasonDatabase();

    const [reasons, setReasons] = useState<
        { id: number; text: string; created_at: string }[]
    >([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const MAX_TEXT_LENGTH = 180;
    const MIN_TEXT_LENGTH = 5;

    const fetchReasons = async () => {
        if (!habit?.id) return;
        const data = await listByHabit(habit.id);
        setReasons(data);
        setSelectedIds([]);
    };

    const handleAdd = async () => {
        Alert.prompt(
            "Nova Razão",
            "Por que quer abandonar esse hábito?",
            async (text) => {
                if (!text?.trim()) return;
                if (text.length < MIN_TEXT_LENGTH) {
                    Alert.alert(
                        "Texto curto demais",
                        `A razão deve ter pelo menos ${MIN_TEXT_LENGTH} caracteres.`
                    );
                    return;
                }
                if (text.length > MAX_TEXT_LENGTH) {
                    Alert.alert(
                        "Texto muito longo",
                        `A razão deve ter no máximo ${MAX_TEXT_LENGTH} caracteres.`
                    );
                    return;
                }

                try {
                    await create({ habit_id: habit.id, text });
                    fetchReasons();
                } catch {
                    Alert.alert("Erro", "Não foi possível adicionar a razão.");
                }
            }
        );
    };

    const handleEdit = async (id: number, currentText: string) => {
        Alert.prompt(
            "Editar Razão",
            "Atualize o texto:",
            async (text) => {
                if (!text?.trim()) return;
                if (text.length < MIN_TEXT_LENGTH) {
                    Alert.alert(
                        "Texto curto demais",
                        `A razão deve ter pelo menos ${MIN_TEXT_LENGTH} caracteres.`
                    );
                    return;
                }
                if (text.length > MAX_TEXT_LENGTH) {
                    Alert.alert(
                        "Texto muito longo",
                        `A razão deve ter no máximo ${MAX_TEXT_LENGTH} caracteres.`
                    );
                    return;
                }

                try {
                    await update(id, text);
                    fetchReasons();
                } catch {
                    Alert.alert("Erro", "Não foi possível atualizar a razão.");
                }
            },
            "plain-text",
            currentText
        );
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        Alert.alert(
            "Apagar razões",
            `Deseja remover ${selectedIds.length} razão(ões)?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            for (const id of selectedIds) {
                                await remove(id);
                            }
                            fetchReasons();
                        } catch {
                            Alert.alert("Erro", "Não foi possível apagar as razões.");
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        fetchReasons();
    }, [habit]);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 80,
                }
            ]}
        >
            <Header transparent>
                {selectedIds.length > 0 && (
                    <IconButton
                        Icon={Trash}
                        IconWeight="bold"
                        onPress={handleDeleteSelected}
                    />
                )}
            </Header>

            <FlatList
                data={reasons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const isSelected = selectedIds.includes(item.id);
                    const date = formatDateToDayMonth(item.created_at);

                    return (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                isSelected && { backgroundColor: colors.gray[100] },
                            ]}
                            onPress={() =>
                                selectedIds.length > 0
                                    ? toggleSelect(item.id)
                                    : handleEdit(item.id, item.text)
                            }
                            onLongPress={() => toggleSelect(item.id)}
                        >
                            <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                                {isSelected ? (
                                    <View
                                        style={[
                                            styles.checkbox,
                                            {
                                                backgroundColor: colors.text.primary,
                                                borderColor: colors.text.primary,
                                            }
                                        ]}
                                    >
                                        <CheckFatIcon
                                            color={colors.white}
                                            weight="fill"
                                            size={14}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.checkbox} />
                                )}
                            </TouchableOpacity>

                            <View style={styles.textWrapper}>
                                <Title fontSize="LARGE">
                                    {item.text}
                                </Title>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4
                                    }}
                                >
                                    <CalendarBlankIcon
                                        color={colors.text.secondary}
                                        size={20}
                                    />

                                    <Description>
                                        {date}
                                    </Description>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <Text style={{ color: colors.gray[500], marginTop: 20 }}>
                        Nenhuma razão ainda.
                    </Text>
                }
                ListHeaderComponent={
                    <View style={{ marginBottom: 24 }}>
                    <Heading fontSize="LARGE">
                        Razões de Desistir
                    </Heading>
                    </View>
                }
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 40,
                    // paddingTop: 40,
                    // gap: 8,
                    backgroundColor: colors.background.primary,
                }}
            />

            {/* Botão flutuante */}
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleAdd}
            >
                <PlusIcon
                    size={28}
                    color="#fff"
                    weight="bold"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background.primary,
    },
    card: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        marginBottom: 16,
    },
    textWrapper: {
        marginHorizontal: 8,
        gap: 8
    },
    text: {
        flex: 1,
        fontSize: 16,
    },
    date: {
        fontSize: 13,
        color: colors.text.secondary,
        marginTop: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: colors.text.secondary,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        position: "absolute",
        bottom: 32,
        right: 24,
        backgroundColor: colors.text.primary,
        borderRadius: 999,
        padding: 16,
    },
});
