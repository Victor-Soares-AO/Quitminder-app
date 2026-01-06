import { supabase } from "@/lib/supabase";
import { SQLiteDatabase } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "./auth";

// Mapeamento entre IDs locais (INTEGER) e UUIDs do Supabase
const SYNC_MAPPING_KEY = '@QuitMinder:syncMapping';

interface SyncMapping {
    habits: Record<number, string>; // local_id -> cloud_id (UUID)
    habitRecords: Record<number, string>;
    affirmations: Record<number, string>;
    reasons: Record<number, string>;
}

export interface ConflictResolution {
    habitId: number;
    localUpdatedAt: string;
    cloudUpdatedAt: string;
    action: 'local' | 'cloud' | 'merge';
}

export async function getSyncMapping(): Promise<SyncMapping> {
    try {
        const saved = await AsyncStorage.getItem(SYNC_MAPPING_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            habits: {},
            habitRecords: {},
            affirmations: {},
            reasons: {},
        };
    } catch (error) {
        console.error("Erro ao carregar mapeamento de sincronização:", error);
        return {
            habits: {},
            habitRecords: {},
            affirmations: {},
            reasons: {},
        };
    }
}

export async function saveSyncMapping(mapping: SyncMapping): Promise<void> {
    try {
        await AsyncStorage.setItem(SYNC_MAPPING_KEY, JSON.stringify(mapping));
    } catch (error) {
        console.error("Erro ao salvar mapeamento de sincronização:", error);
        throw error;
    }
}

// Converter dados locais para formato do Supabase
function convertHabitToCloud(habit: any): any {
    return {
        name: habit.name,
        cover: habit.cover,
        color: habit.color,
        last_relapse_date: habit.last_relapse_date,
        daily_spent_time: habit.daily_spent_time,
        daily_spent_money: habit.daily_spent_money,
        default_currency: habit.default_currency,
        created_at: habit.created_at,
        updated_at: habit.updated_at,
    };
}

function convertHabitRecordToCloud(record: any): any {
    return {
        title: record.title,
        note: record.note,
        date_time: record.date_time,
        is_reset: record.is_reset === 1 || record.is_reset === true,
        time_spent: record.time_spent,
        money_spent: record.money_spent,
        currency: record.currency,
        created_at: record.created_at,
        updated_at: record.updated_at,
    };
}

function convertAffirmationToCloud(affirmation: any): any {
    return {
        text: affirmation.text,
        created_at: affirmation.created_at,
    };
}

function convertReasonToCloud(reason: any): any {
    return {
        text: reason.text,
        created_at: reason.created_at,
    };
}

// Upload: Enviar dados locais para a nuvem
export async function uploadToCloud(database: SQLiteDatabase): Promise<{ success: boolean; conflicts: ConflictResolution[] }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        const mapping = await getSyncMapping();
        const conflicts: ConflictResolution[] = [];

        // 1. Sincronizar Habits
        const localHabits = await database.getAllAsync(`
            SELECT * FROM habits ORDER BY updated_at DESC
        `);

        for (const habit of localHabits) {
            const cloudId = mapping.habits[habit.id];
            
            if (cloudId) {
                // Habit já existe na nuvem - verificar conflito
                const { data: cloudHabit } = await supabase
                    .from('habits')
                    .select('updated_at')
                    .eq('id', cloudId)
                    .single();

                if (cloudHabit) {
                    const localDate = new Date(habit.updated_at);
                    const cloudDate = new Date(cloudHabit.updated_at);
                    
                    if (localDate > cloudDate) {
                        // Local é mais recente - atualizar nuvem
                        await supabase
                            .from('habits')
                            .update(convertHabitToCloud(habit))
                            .eq('id', cloudId);
                    } else if (cloudDate > localDate) {
                        // Nuvem é mais recente - conflito
                        conflicts.push({
                            habitId: habit.id,
                            localUpdatedAt: habit.updated_at,
                            cloudUpdatedAt: cloudHabit.updated_at,
                            action: 'cloud',
                        });
                    }
                }
            } else {
                // Habit novo - criar na nuvem
                const { data, error } = await supabase
                    .from('habits')
                    .insert({
                        ...convertHabitToCloud(habit),
                        user_id: user.id,
                    })
                    .select('id')
                    .single();

                if (data && !error) {
                    mapping.habits[habit.id] = data.id;
                }
            }
        }

        // 2. Sincronizar Habit Records
        const localRecords = await database.getAllAsync(`
            SELECT * FROM habit_records ORDER BY updated_at DESC
        `);

        for (const record of localRecords) {
            const cloudHabitId = mapping.habits[record.habit_id];
            if (!cloudHabitId) continue; // Habit ainda não foi sincronizado

            const cloudId = mapping.habitRecords[record.id];
            
            if (cloudId) {
                // Record já existe - verificar conflito
                const { data: cloudRecord } = await supabase
                    .from('habit_records')
                    .select('updated_at')
                    .eq('id', cloudId)
                    .single();

                if (cloudRecord) {
                    const localDate = new Date(record.updated_at);
                    const cloudDate = new Date(cloudRecord.updated_at);
                    
                    if (localDate > cloudDate) {
                        await supabase
                            .from('habit_records')
                            .update(convertHabitRecordToCloud(record))
                            .eq('id', cloudId);
                    }
                }
            } else {
                // Record novo
                const { data, error } = await supabase
                    .from('habit_records')
                    .insert({
                        ...convertHabitRecordToCloud(record),
                        habit_id: cloudHabitId,
                    })
                    .select('id')
                    .single();

                if (data && !error) {
                    mapping.habitRecords[record.id] = data.id;
                }
            }
        }

        // 3. Sincronizar Affirmations
        const localAffirmations = await database.getAllAsync(`
            SELECT * FROM affirmations ORDER BY created_at DESC
        `);

        for (const affirmation of localAffirmations) {
            const cloudHabitId = mapping.habits[affirmation.habit_id];
            if (!cloudHabitId) continue;

            const cloudId = mapping.affirmations[affirmation.id];
            
            if (!cloudId) {
                // Verificar se já existe na nuvem (unique constraint)
                const { data: existing } = await supabase
                    .from('affirmations')
                    .select('id')
                    .eq('habit_id', cloudHabitId)
                    .eq('text', affirmation.text)
                    .single();

                if (!existing) {
                    const { data, error } = await supabase
                        .from('affirmations')
                        .insert({
                            ...convertAffirmationToCloud(affirmation),
                            habit_id: cloudHabitId,
                        })
                        .select('id')
                        .single();

                    if (data && !error) {
                        mapping.affirmations[affirmation.id] = data.id;
                    }
                }
            }
        }

        // 4. Sincronizar Reasons
        const localReasons = await database.getAllAsync(`
            SELECT * FROM reasons ORDER BY created_at DESC
        `);

        for (const reason of localReasons) {
            const cloudHabitId = mapping.habits[reason.habit_id];
            if (!cloudHabitId) continue;

            const cloudId = mapping.reasons[reason.id];
            
            if (!cloudId) {
                const { data: existing } = await supabase
                    .from('reasons')
                    .select('id')
                    .eq('habit_id', cloudHabitId)
                    .eq('text', reason.text)
                    .single();

                if (!existing) {
                    const { data, error } = await supabase
                        .from('reasons')
                        .insert({
                            ...convertReasonToCloud(reason),
                            habit_id: cloudHabitId,
                        })
                        .select('id')
                        .single();

                    if (data && !error) {
                        mapping.reasons[reason.id] = data.id;
                    }
                }
            }
        }

        await saveSyncMapping(mapping);

        return { success: true, conflicts };
    } catch (error) {
        console.error("Erro ao fazer upload para nuvem:", error);
        throw error;
    }
}

// Download: Baixar dados da nuvem para local
export async function downloadFromCloud(database: SQLiteDatabase): Promise<{ success: boolean; conflicts: ConflictResolution[] }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        const mapping = await getSyncMapping();
        const conflicts: ConflictResolution[] = [];

        // 1. Baixar Habits
        const { data: cloudHabits, error: habitsError } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (habitsError) throw habitsError;

        console.log(`[SYNC] Baixando ${cloudHabits?.length || 0} hábitos da nuvem`);

        for (const cloudHabit of cloudHabits || []) {
            // Verificar se já existe localmente pelo mapeamento
            const localIdKey = Object.keys(mapping.habits).find(
                key => mapping.habits[parseInt(key)] === cloudHabit.id
            );

            if (localIdKey) {
                const localId = parseInt(localIdKey);
                // Verificar conflito
                const localHabit = await database.getFirstAsync(`
                    SELECT * FROM habits WHERE id = ?
                `, [localId]);

                if (localHabit) {
                    const localDate = new Date(localHabit.updated_at);
                    const cloudDate = new Date(cloudHabit.updated_at);
                    
                    if (cloudDate > localDate) {
                        // Atualizar local com dados da nuvem
                        const updateStatement = await database.prepareAsync(`
                            UPDATE habits SET
                                name = $name,
                                cover = $cover,
                                color = $color,
                                last_relapse_date = $last_relapse_date,
                                daily_spent_time = $daily_spent_time,
                                daily_spent_money = $daily_spent_money,
                                default_currency = $default_currency,
                                updated_at = $updated_at
                            WHERE id = $id
                        `);
                        
                        await updateStatement.executeAsync({
                            $id: localId,
                            $name: cloudHabit.name,
                            $cover: cloudHabit.cover || null,
                            $color: cloudHabit.color || null,
                            $last_relapse_date: cloudHabit.last_relapse_date || null,
                            $daily_spent_time: cloudHabit.daily_spent_time || 0,
                            $daily_spent_money: cloudHabit.daily_spent_money || 0,
                            $default_currency: cloudHabit.default_currency || 'KZ',
                            $updated_at: cloudHabit.updated_at,
                        });
                    } else if (localDate > cloudDate) {
                        conflicts.push({
                            habitId: localId,
                            localUpdatedAt: localHabit.updated_at,
                            cloudUpdatedAt: cloudHabit.updated_at,
                            action: 'local',
                        });
                    }
                }
            } else {
                // Habit novo - criar localmente
                const statement = await database.prepareAsync(`
                    INSERT INTO habits (
                        name, cover, color, last_relapse_date,
                        daily_spent_time, daily_spent_money, default_currency,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const result = await statement.executeAsync([
                    cloudHabit.name,
                    cloudHabit.cover || null,
                    cloudHabit.color || null,
                    cloudHabit.last_relapse_date || null,
                    cloudHabit.daily_spent_time || 0,
                    cloudHabit.daily_spent_money || 0,
                    cloudHabit.default_currency || 'KZ',
                    cloudHabit.created_at,
                    cloudHabit.updated_at,
                ]);

                const localId = result.lastInsertRowId;
                mapping.habits[localId] = cloudHabit.id;
                console.log(`[SYNC] Habit criado localmente: ID local=${localId}, ID nuvem=${cloudHabit.id}`);
            }
        }

        // 2. Baixar Habit Records (após habits)
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudRecords } = await supabase
                .from('habit_records')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('updated_at', { ascending: false });

            for (const cloudRecord of cloudRecords || []) {
                const localRecordId = Object.keys(mapping.habitRecords).find(
                    key => mapping.habitRecords[parseInt(key)] === cloudRecord.id
                );

                if (!localRecordId) {
                    // Record novo
                    const statement = await database.prepareAsync(`
                        INSERT INTO habit_records (
                            habit_id, title, note, date_time, is_reset,
                            time_spent, money_spent, currency,
                            created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    const result = await statement.executeAsync([
                        parseInt(localHabitId),
                        cloudRecord.title || null,
                        cloudRecord.note || null,
                        cloudRecord.date_time,
                        cloudRecord.is_reset ? 1 : 0,
                        cloudRecord.time_spent || null,
                        cloudRecord.money_spent || null,
                        cloudRecord.currency || null,
                        cloudRecord.created_at,
                        cloudRecord.updated_at,
                    ]);

                    const localId = result.lastInsertRowId;
                    mapping.habitRecords[localId] = cloudRecord.id;
                }
            }
        }

        // 3. Baixar Affirmations
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudAffirmations } = await supabase
                .from('affirmations')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: false });

            for (const cloudAffirmation of cloudAffirmations || []) {
                const localAffirmationId = Object.keys(mapping.affirmations).find(
                    key => mapping.affirmations[parseInt(key)] === cloudAffirmation.id
                );

                if (!localAffirmationId) {
                    // Verificar se já existe localmente (unique constraint)
                    const existing = await database.getFirstAsync(`
                        SELECT id FROM affirmations
                        WHERE habit_id = ? AND text = ?
                    `, [parseInt(localHabitId), cloudAffirmation.text]);

                    if (!existing) {
                        const statement = await database.prepareAsync(`
                            INSERT INTO affirmations (habit_id, text, created_at)
                            VALUES (?, ?, ?)
                        `);

                        const result = await statement.executeAsync([
                            parseInt(localHabitId),
                            cloudAffirmation.text,
                            cloudAffirmation.created_at,
                        ]);

                        const localId = result.lastInsertRowId;
                        mapping.affirmations[localId] = cloudAffirmation.id;
                    }
                }
            }
        }

        // 4. Baixar Reasons
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudReasons } = await supabase
                .from('reasons')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: false });

            for (const cloudReason of cloudReasons || []) {
                const localReasonId = Object.keys(mapping.reasons).find(
                    key => mapping.reasons[parseInt(key)] === cloudReason.id
                );

                if (!localReasonId) {
                    const existing = await database.getFirstAsync(`
                        SELECT id FROM reasons
                        WHERE habit_id = ? AND text = ?
                    `, [parseInt(localHabitId), cloudReason.text]);

                    if (!existing) {
                        const statement = await database.prepareAsync(`
                            INSERT INTO reasons (habit_id, text, created_at)
                            VALUES (?, ?, ?)
                        `);

                        const result = await statement.executeAsync([
                            parseInt(localHabitId),
                            cloudReason.text,
                            cloudReason.created_at,
                        ]);

                        const localId = result.lastInsertRowId;
                        mapping.reasons[localId] = cloudReason.id;
                    }
                }
            }
        }

        await saveSyncMapping(mapping);
        
        console.log(`[SYNC] Download concluído. Mapeamento salvo:`, {
            habits: Object.keys(mapping.habits).length,
            records: Object.keys(mapping.habitRecords).length,
            affirmations: Object.keys(mapping.affirmations).length,
            reasons: Object.keys(mapping.reasons).length,
        });

        return { success: true, conflicts };
    } catch (error) {
        console.error("Erro ao fazer download da nuvem:", error);
        throw error;
    }
}

// Sincronização bidirecional com resolução de conflitos
export async function syncData(
    database: SQLiteDatabase,
    conflictResolver?: (conflicts: ConflictResolution[]) => Promise<ConflictResolution[]>
): Promise<{ success: boolean; uploaded: number; downloaded: number; conflicts: ConflictResolution[] }> {
    try {
        // Primeiro fazer upload
        const uploadResult = await uploadToCloud(database);
        
        // Depois fazer download
        const downloadResult = await downloadFromCloud(database);

        // Resolver conflitos se houver
        const allConflicts = [...uploadResult.conflicts, ...downloadResult.conflicts];
        let resolvedConflicts: ConflictResolution[] = [];

        if (allConflicts.length > 0 && conflictResolver) {
            resolvedConflicts = await conflictResolver(allConflicts);
            
            // Aplicar resoluções
            for (const conflict of resolvedConflicts) {
                if (conflict.action === 'cloud') {
                    // Baixar versão da nuvem
                    // Implementar lógica específica
                } else if (conflict.action === 'local') {
                    // Manter versão local e fazer upload
                    // Implementar lógica específica
                }
            }
        }

        return {
            success: true,
            uploaded: 0, // Contar itens sincronizados
            downloaded: 0,
            conflicts: resolvedConflicts,
        };
    } catch (error) {
        console.error("Erro na sincronização:", error);
        throw error;
    }
}

