import { useSQLiteContext } from "expo-sqlite";

export type HabitRecordCreate = {
    habit_id: number;
    title?: string;
    note?: string;
    date_time: string;
    is_reset: number;
    time_spent?: number;
    money_spent?: number;
    currency?: string;
};

export type HabitRecordResponse = {
    id: number;
    habit_id: number;
    title?: string;
    note?: string;
    date_time: string;
    is_reset: number;
    time_spent?: number;
    money_spent?: number;
    currency?: string;
    created_at: string;
    updated_at: string;
};

export function useHabitRecordDatabase() {
    const database = useSQLiteContext();

    const create = async (data: HabitRecordCreate) => {
        try {
            const statement = await database.prepareAsync(`
                INSERT INTO habit_records (
                    habit_id,
                    title,
                    note,
                    date_time,
                    is_reset,
                    time_spent,
                    money_spent,
                    currency
                ) VALUES (
                    $habit_id,
                    $title,
                    $note,
                    $date_time,
                    $is_reset,
                    $time_spent,
                    $money_spent,
                    $currency
                )
            `);

            await statement.executeAsync({
                $habit_id: data.habit_id,
                $title: data.title || null,
                $note: data.note || null,
                $date_time: data.date_time,
                $is_reset: data.is_reset,
                $time_spent: data.time_spent || null,
                $money_spent: data.money_spent || null,
                $currency: data.currency || null,
            });
        } catch (error) {
            console.error("Erro ao criar registro:", error);
            throw error;
        }
    };

    const listByHabit = async (habitId: number) => {
        try {
            return await database.getAllAsync<HabitRecordResponse>(`
                SELECT *
                FROM habit_records
                WHERE habit_id = ${habitId}
                ORDER BY date_time DESC, created_at DESC
            `);
        } catch (error) {
            console.error("Erro ao listar registros:", error);
            throw error;
        }
    };

    const show = async (id: number) => {
        try {
            return await database.getFirstAsync<HabitRecordResponse>(`
                SELECT *
                FROM habit_records
                WHERE id = ${id}
            `);
        } catch (error) {
            console.error("Erro ao buscar registro:", error);
            throw error;
        }
    };

    const update = async (id: number, data: Partial<HabitRecordCreate>) => {
        try {
            const statement = await database.prepareAsync(`
                UPDATE habit_records
                SET
                    title = COALESCE($title, title),
                    note = COALESCE($note, note),
                    date_time = COALESCE($date_time, date_time),
                    is_reset = COALESCE($is_reset, is_reset),
                    time_spent = COALESCE($time_spent, time_spent),
                    money_spent = COALESCE($money_spent, money_spent),
                    currency = COALESCE($currency, currency),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $id
            `);

            await statement.executeAsync({
                $id: id,
                $title: data.title,
                $note: data.note,
                $date_time: data.date_time,
                $is_reset: data.is_reset,
                $time_spent: data.time_spent,
                $money_spent: data.money_spent,
                $currency: data.currency,
            });
        } catch (error) {
            console.error("Erro ao atualizar registro:", error);
            throw error;
        }
    };

    const remove = async (id: number) => {
        try {
            await database.execAsync(`DELETE FROM habit_records WHERE id = ${id}`);
        } catch (error) {
            console.error("Erro ao apagar registro:", error);
            throw error;
        }
    };

    // Buscar o último registro de recaída (is_reset = 1) de um hábito
    const getLastResetRecord = async (habitId: number) => {
        try {
            return await database.getFirstAsync<HabitRecordResponse>(`
                SELECT *
                FROM habit_records
                WHERE habit_id = ${habitId} AND is_reset = 1
                ORDER BY date_time DESC, created_at DESC
                LIMIT 1
            `);
        } catch (error) {
            console.error("Erro ao buscar último registro de recaída:", error);
            throw error;
        }
    };

    return {
        create,
        listByHabit,
        show,
        update,
        remove,
        getLastResetRecord,
    };
}

