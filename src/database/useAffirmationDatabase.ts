import { useSQLiteContext } from "expo-sqlite";

export type AffirmationCreate = {
    habit_id: number;
    text: string;
};

export type AffirmationResponse = {
    id: number;
    habit_id: number;
    text: string;
    created_at: string;
};

export function useAffirmationDatabase() {
    const database = useSQLiteContext();

    // ✅ Criar uma nova afirmação
    const create = async (data: AffirmationCreate) => {
        try {
            const statement = await database.prepareAsync(`
        INSERT INTO affirmations (habit_id, text)
        VALUES ($habit_id, $text)
      `);

            await statement.executeAsync({
                $habit_id: data.habit_id,
                $text: data.text.trim(),
            });
        } catch (error) {
            console.error("Erro ao criar afirmação:", error);
            throw error;
        }
    };

    // ✅ Listar afirmações por hábito
    const listByHabit = async (habitId: number) => {
        try {
            return await database.getAllAsync<AffirmationResponse>(`
        SELECT id, habit_id, text, created_at
        FROM affirmations
        WHERE habit_id = ${habitId}
        ORDER BY created_at DESC
      `);
        } catch (error) {
            console.error("Erro ao listar afirmações:", error);
            throw error;
        }
    };

    // ✅ Atualizar texto da afirmação
    const update = async (id: number, newText: string) => {
        try {
            const statement = await database.prepareAsync(`
        UPDATE affirmations
        SET text = $text
        WHERE id = $id
      `);

            await statement.executeAsync({
                $text: newText.trim(),
                $id: id,
            });
        } catch (error) {
            console.error("Erro ao atualizar afirmação:", error);
            throw error;
        }
    };

    // ✅ Apagar afirmação
    const remove = async (id: number) => {
        try {
            await database.execAsync(`
        DELETE FROM affirmations WHERE id = ${id}
      `);
        } catch (error) {
            console.error("Erro ao apagar afirmação:", error);
            throw error;
        }
    };

    return {
        create,
        listByHabit,
        update,
        remove,
    };
}
