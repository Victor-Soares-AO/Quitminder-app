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
  CheckCircle,
//   Circle,
  PencilSimple,
  CircleIcon,
} from "phosphor-react-native";
import { colors } from "@/theme";
import { useAffirmationDatabase } from "@/database/useAffirmationDatabase";
import { useHabit } from "@/contexts/useHabit";

export default function Affirmations() {
  const { habit } = useHabit();
  const { create, listByHabit, update, remove } = useAffirmationDatabase();

  const [affirmations, setAffirmations] = useState<
    { id: number; text: string }[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const DEFAULT_AFFIRMATIONS = [
    "Eu sou mais forte que meus impulsos.",
    "Cada dia sem recaída é uma vitória.",
    "Estou no controle das minhas escolhas.",
  ];

  const MIN_TEXT_LENGTH = 5;
  const MAX_TEXT_LENGTH = 150;
  const MIN_AFFIRMATIONS = 3;

  const fetchAffirmations = async () => {
    if (!habit?.id) return;
    const data = await listByHabit(habit.id);

    if (data.length === 0) {
      for (const text of DEFAULT_AFFIRMATIONS) {
        await create({ habit_id: habit.id, text });
      }
      const newData = await listByHabit(habit.id);
      setAffirmations(newData);
    } else {
      setAffirmations(data);
    }

    setSelectedIds([]);
  };

  const handleAdd = async () => {
    Alert.prompt(
      "Nova Afirmação",
      "Digite uma frase positiva:",
      async (text) => {
        if (!text?.trim()) return;
        if (text.length < MIN_TEXT_LENGTH) {
          Alert.alert(
            "Frase curta demais",
            `A frase deve ter pelo menos ${MIN_TEXT_LENGTH} caracteres.`
          );
          return;
        }
        if (text.length > MAX_TEXT_LENGTH) {
          Alert.alert(
            "Frase muito longa",
            `A frase deve ter no máximo ${MAX_TEXT_LENGTH} caracteres.`
          );
          return;
        }

        try {
          await create({ habit_id: habit.id, text });
          fetchAffirmations();
        } catch {
          Alert.alert("Erro", "Não foi possível adicionar a frase.");
        }
      }
    );
  };

  const handleEdit = async (id: number, currentText: string) => {
    Alert.prompt(
      "Editar Afirmação",
      "Atualize o texto da afirmação:",
      async (text) => {
        if (!text?.trim()) return;

        if (text.length < MIN_TEXT_LENGTH) {
          Alert.alert(
            "Frase curta demais",
            `A frase deve ter pelo menos ${MIN_TEXT_LENGTH} caracteres.`
          );
          return;
        }
        if (text.length > MAX_TEXT_LENGTH) {
          Alert.alert(
            "Frase muito longa",
            `A frase deve ter no máximo ${MAX_TEXT_LENGTH} caracteres.`
          );
          return;
        }

        try {
          await update(id, text);
          fetchAffirmations();
        } catch {
          Alert.alert("Erro", "Não foi possível atualizar a frase.");
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
    if (affirmations.length - selectedIds.length < MIN_AFFIRMATIONS) {
      Alert.alert(
        "Ação bloqueada",
        `Você precisa manter pelo menos ${MIN_AFFIRMATIONS} afirmações.`
      );
      return;
    }

    Alert.alert(
      "Apagar afirmações",
      `Deseja remover ${selectedIds.length} afirmação(ões)?`,
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
              fetchAffirmations();
            } catch {
              Alert.alert("Erro", "Não foi possível apagar as afirmações.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchAffirmations();
  }, [habit]);

  return (
    <View style={[styles.container, { paddingTop: 80 }]}>
      <Header>
        {selectedIds.length > 0 && (
          <IconButton
            Icon={Trash}
            IconWeight="bold"
            onPress={handleDeleteSelected}
          />
        )}
      </Header>

      <Text style={styles.title}>Afirmações Positivas</Text>

      <FlatList
        data={affirmations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
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
              <TouchableOpacity
                onPress={() => toggleSelect(item.id)}
                style={styles.checkbox}
              >
                {isSelected ? (
                  <CheckCircle
                    size={24}
                    color={colors.text.primary}
                    weight="fill"
                  />
                ) : (
                  <CircleIcon size={24} color={colors.gray[500]} />
                )}
              </TouchableOpacity>

              <Text style={styles.text}>{item.text}</Text>

              <PencilSimple
                size={18}
                color={colors.gray[600]}
                // onPress={() => handleEdit(item.id, item.text)}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: colors.gray[500], marginTop: 20 }}>
            Nenhuma afirmação ainda.
          </Text>
        }
      />

      {/* Botão flutuante de adicionar */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleAdd}
      >
        <PlusIcon size={22} color="#fff" weight="bold" />
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: colors.text.primary,
    borderRadius: 999,
    padding: 18,
    elevation: 5,
  },
});
