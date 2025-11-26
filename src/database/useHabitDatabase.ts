import { useSQLiteContext } from "expo-sqlite";
import { HabitCreateDTO, HabitResponseDTO } from "../dtos/habit.dto";

export function useHabitDatabase() {
    const database = useSQLiteContext();

    const create = async (data: HabitCreateDTO) => {
        const statement = await database.prepareAsync(`
        INSERT INTO habits (
            name,
            cover,
            color,
            last_relapse_date,
            daily_spent_time,
            daily_spent_money,
            default_currency
        ) VALUES (
            $name,
            $cover,
            $color,
            $last_relapse_date,
            $daily_spent_time,
            $daily_spent_money,
            $default_currency
        )
    `);

        await statement.executeAsync({
            $name: data.name,
            $cover: data.cover,
            $color: data.color,
            $last_relapse_date: data.last_relapse_date.toISOString(),
            $daily_spent_time: data.daily_spent_time,
            $daily_spent_money: data.daily_spent_money,
            $default_currency: data.default_currency,
        });
    };

    const list = () => {
        return database.getAllAsync<HabitResponseDTO>(`
        SELECT
            id,
            name,
            cover,
            color,
            last_relapse_date,
            daily_spent_time,
            daily_spent_money,
            default_currency,
            created_at,
            updated_at
        FROM habits
        ORDER BY created_at DESC
    `);
    };

    const show = (id: number) => {
        return database.getFirstAsync<HabitResponseDTO>(`
        SELECT
            id,
            name,
            cover,
            color,
            last_relapse_date,
            daily_spent_time,
            daily_spent_money,
            default_currency,
            created_at,
            updated_at
        FROM habits
        WHERE id = ${id}
    `);
    };

    const update = async (id: number, data: Partial<HabitCreateDTO>) => {
        const statement = await database.prepareAsync(`
        UPDATE habits
        SET
            name = COALESCE($name, name),
            cover = COALESCE($cover, cover),
            color = COALESCE($color, color),
            daily_spent_time = COALESCE($daily_spent_time, daily_spent_time),
            daily_spent_money = COALESCE($daily_spent_money, daily_spent_money),
            default_currency = COALESCE($default_currency, default_currency),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $id
    `);

        await statement.executeAsync({
            $id: id,
            $name: data.name,
            $cover: data.cover,
            $color: data.color,
            $daily_spent_time: data.daily_spent_time,
            $daily_spent_money: data.daily_spent_money,
            $default_currency: data.default_currency,
        });
    };

    const remove = async (id: number) => {
        await database.execAsync(`DELETE FROM habits WHERE id = ${id}`);
    };

    return {
        create,
        list,
        show,
        update,
        remove,
    };
}
