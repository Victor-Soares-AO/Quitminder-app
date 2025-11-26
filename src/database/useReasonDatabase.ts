import { useSQLiteContext } from "expo-sqlite";

export type ReasonCreate = {
  habit_id: number;
  text: string;
};

export type ReasonResponse = {
  id: number;
  habit_id: number;
  text: string;
  created_at: string;
};

export function useReasonDatabase() {
  const database = useSQLiteContext();

  const create = async (data: ReasonCreate) => {
    const statement = await database.prepareAsync(`
      INSERT INTO reasons (habit_id, text)
      VALUES ($habit_id, $text)
    `);

    await statement.executeAsync({
      $habit_id: data.habit_id,
      $text: data.text,
    });
  };

  const listByHabit = (habit_id: number) => {
    return database.getAllAsync<ReasonResponse>(
      `SELECT * FROM reasons WHERE habit_id = ? ORDER BY created_at DESC`,
      [habit_id]
    );
  };

  const update = async (id: number, text: string) => {
    const statement = await database.prepareAsync(`
      UPDATE reasons
      SET text = $text
      WHERE id = $id
    `);

    await statement.executeAsync({ $id: id, $text: text });
  };

  const remove = async (id: number) => {
    await database.execAsync(`DELETE FROM reasons WHERE id = ${id}`);
  };

  return { create, listByHabit, update, remove };
}
