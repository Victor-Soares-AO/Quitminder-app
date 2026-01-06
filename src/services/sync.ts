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
        name: habit.name || '',
        cover: habit.cover || null,
        color: habit.color || null,
        last_relapse_date: habit.last_relapse_date || null,
        daily_spent_time: habit.daily_spent_time ?? 0,
        daily_spent_money: habit.daily_spent_money ?? 0,
        default_currency: habit.default_currency || 'KZ',
        created_at: habit.created_at || new Date().toISOString(),
        updated_at: habit.updated_at || new Date().toISOString(),
    };
}

function convertHabitRecordToCloud(record: any): any {
    return {
        title: record.title || null,
        note: record.note || null,
        date_time: record.date_time || new Date().toISOString(),
        is_reset: record.is_reset === 1 || record.is_reset === true,
        time_spent: record.time_spent ?? null,
        money_spent: record.money_spent ?? null,
        currency: record.currency || null,
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString(),
    };
}

function convertAffirmationToCloud(affirmation: any): any {
    return {
        text: affirmation.text || '',
        created_at: affirmation.created_at || new Date().toISOString(),
    };
}

function convertReasonToCloud(reason: any): any {
    return {
        text: reason.text || '',
        created_at: reason.created_at || new Date().toISOString(),
    };
}

// Upload: Limpar tudo na nuvem e enviar tudo do telefone
export async function uploadToCloud(database: SQLiteDatabase): Promise<{ success: boolean; conflicts: ConflictResolution[] }> {
    try {
        // Verificar e atualizar a sessão do Supabase antes de fazer operações
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            console.error("[SYNC] Erro na sessão:", sessionError);
            throw new Error("Sessão do Supabase não encontrada. Por favor, faça login novamente.");
        }

        // Verificar se a sessão não expirou
        if (session.expires_at && session.expires_at < Date.now() / 1000) {
            console.error("[SYNC] Sessão expirada");
            throw new Error("Sessão expirada. Por favor, faça login novamente.");
        }

        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        // Garantir que o user_id da sessão corresponde ao user.id
        const activeUserId = session.user.id;
        if (activeUserId !== user.id) {
            console.warn("[SYNC] ID do usuário na sessão difere do ID salvo. Usando ID da sessão.");
        }

        // Verificar auth.uid() explicitamente
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            console.error("[SYNC] Erro ao obter usuário autenticado:", authError);
            throw new Error("Não foi possível verificar autenticação. Por favor, faça login novamente.");
        }

        if (authUser.id !== activeUserId) {
            console.warn(`[SYNC] Diferença entre session.user.id (${activeUserId}) e auth.user.id (${authUser.id})`);
        }

        console.log(`[SYNC] Sessão verificada - User ID: ${activeUserId}, Auth User ID: ${authUser.id}`);

        // 1. Limpar tudo na nuvem do usuário
        // Primeiro deletar registros dependentes (cascade não funciona no Supabase da mesma forma)
        const { data: cloudHabits, error: fetchError } = await supabase
            .from('habits')
            .select('id')
            .eq('user_id', activeUserId);

        if (fetchError) {
            console.error("[SYNC] Erro ao buscar hábitos na nuvem:", fetchError);
            throw fetchError;
        }

        if (cloudHabits && cloudHabits.length > 0) {
            const habitIds = (cloudHabits as any[]).map((h: any) => h.id);
            console.log(`[SYNC] Limpando ${habitIds.length} hábitos da nuvem`);

            // Deletar habit_records
            const { error: recordsError } = await supabase
                .from('habit_records')
                .delete()
                .in('habit_id', habitIds);
            if (recordsError) {
                console.error("[SYNC] Erro ao deletar habit_records:", recordsError);
                throw recordsError;
            }

            // Deletar affirmations
            const { error: affirmationsError } = await supabase
                .from('affirmations')
                .delete()
                .in('habit_id', habitIds);
            if (affirmationsError) {
                console.error("[SYNC] Erro ao deletar affirmations:", affirmationsError);
                throw affirmationsError;
            }

            // Deletar reasons
            const { error: reasonsError } = await supabase
                .from('reasons')
                .delete()
                .in('habit_id', habitIds);
            if (reasonsError) {
                console.error("[SYNC] Erro ao deletar reasons:", reasonsError);
                throw reasonsError;
            }

            // Deletar habits
            const { error: habitsError } = await supabase
                .from('habits')
                .delete()
                .eq('user_id', activeUserId);
            if (habitsError) {
                console.error("[SYNC] Erro ao deletar habits:", habitsError);
                throw habitsError;
            }
        }

        // 2. Criar novo mapeamento vazio
        const mapping: SyncMapping = {
            habits: {},
            habitRecords: {},
            affirmations: {},
            reasons: {},
        };

        // 3. Enviar todos os dados locais para a nuvem
        // 3.1. Enviar Habits
        const localHabits = await database.getAllAsync(`
            SELECT * FROM habits ORDER BY created_at ASC
        `);

        console.log(`[SYNC] Enviando ${localHabits.length} hábitos para a nuvem`);

        for (const habit of localHabits as any[]) {
            const h = habit as any;
            const habitData = convertHabitToCloud(h);
            
            const insertData = {
                ...habitData,
                user_id: activeUserId,
            };
            
            console.log(`[SYNC] Inserindo hábito ${h.id} (${h.name}) com user_id: ${activeUserId}`);
            
            const { data, error } = await supabase
                .from('habits')
                .insert(insertData)
                .select('id')
                .single();

            if (error) {
                console.error(`[SYNC] Erro ao inserir hábito ${h.id} (${h.name}):`, error);
                console.error(`[SYNC] Código do erro:`, error.code);
                console.error(`[SYNC] Mensagem:`, error.message);
                console.error(`[SYNC] Detalhes:`, error.details);
                console.error(`[SYNC] Hint:`, error.hint);
                console.error(`[SYNC] User ID usado:`, activeUserId);
                console.error(`[SYNC] Auth User ID:`, authUser.id);
                console.error(`[SYNC] Dados do hábito:`, JSON.stringify(insertData, null, 2));
                throw new Error(`Erro ao inserir hábito: ${error.message}`);
            }

            if (data) {
                mapping.habits[h.id] = (data as any).id;
                console.log(`[SYNC] Hábito ${h.id} -> ${(data as any).id} sincronizado`);
            }
        }

        // 3.2. Enviar Habit Records
        const localRecords = await database.getAllAsync(`
            SELECT * FROM habit_records ORDER BY created_at ASC
        `);

        console.log(`[SYNC] Enviando ${localRecords.length} registros para a nuvem`);

        for (const record of localRecords as any[]) {
            const r = record as any;
            const cloudHabitId = mapping.habits[r.habit_id];
            if (!cloudHabitId) {
                console.warn(`[SYNC] Habit record ${r.id} ignorado - habit_id ${r.habit_id} não encontrado no mapeamento`);
                continue;
            }

            const recordData = convertHabitRecordToCloud(r);
            const { data, error } = await supabase
                .from('habit_records')
                .insert({
                    ...recordData,
                    habit_id: cloudHabitId,
                })
                .select('id')
                .single();

            if (error) {
                console.error(`[SYNC] Erro ao inserir habit_record ${r.id}:`, error);
                throw new Error(`Erro ao inserir registro: ${error.message}`);
            }

            if (data) {
                mapping.habitRecords[r.id] = (data as any).id;
            }
        }

        // 3.3. Enviar Affirmations
        const localAffirmations = await database.getAllAsync(`
            SELECT * FROM affirmations ORDER BY created_at ASC
        `);

        console.log(`[SYNC] Enviando ${localAffirmations.length} afirmações para a nuvem`);

        for (const affirmation of localAffirmations as any[]) {
            const a = affirmation as any;
            const cloudHabitId = mapping.habits[a.habit_id];
            if (!cloudHabitId) {
                console.warn(`[SYNC] Affirmation ${a.id} ignorada - habit_id ${a.habit_id} não encontrado no mapeamento`);
                continue;
            }

            const affirmationData = convertAffirmationToCloud(a);
            const { data, error } = await supabase
                .from('affirmations')
                .insert({
                    ...affirmationData,
                    habit_id: cloudHabitId,
                })
                .select('id')
                .single();

            if (error) {
                console.error(`[SYNC] Erro ao inserir affirmation ${a.id}:`, error);
                throw new Error(`Erro ao inserir afirmação: ${error.message}`);
            }

            if (data) {
                mapping.affirmations[a.id] = (data as any).id;
            }
        }

        // 3.4. Enviar Reasons
        const localReasons = await database.getAllAsync(`
            SELECT * FROM reasons ORDER BY created_at ASC
        `);

        console.log(`[SYNC] Enviando ${localReasons.length} razões para a nuvem`);

        for (const reason of localReasons as any[]) {
            const r = reason as any;
            const cloudHabitId = mapping.habits[r.habit_id];
            if (!cloudHabitId) {
                console.warn(`[SYNC] Reason ${r.id} ignorada - habit_id ${r.habit_id} não encontrado no mapeamento`);
                continue;
            }

            const reasonData = convertReasonToCloud(r);
            const { data, error } = await supabase
                .from('reasons')
                .insert({
                    ...reasonData,
                    habit_id: cloudHabitId,
                })
                .select('id')
                .single();

            if (error) {
                console.error(`[SYNC] Erro ao inserir reason ${r.id}:`, error);
                throw new Error(`Erro ao inserir razão: ${error.message}`);
            }

            if (data) {
                mapping.reasons[r.id] = (data as any).id;
            }
        }

        await saveSyncMapping(mapping);

        console.log(`[SYNC] Upload concluído: ${Object.keys(mapping.habits).length} hábitos, ${Object.keys(mapping.habitRecords).length} registros, ${Object.keys(mapping.affirmations).length} afirmações, ${Object.keys(mapping.reasons).length} razões`);

        return { success: true, conflicts: [] };
    } catch (error) {
        console.error("Erro ao fazer upload para nuvem:", error);
        throw error;
    }
}

// Download: Apagar tudo do telefone e usar dados da nuvem
export async function downloadFromCloud(database: SQLiteDatabase): Promise<{ success: boolean; conflicts: ConflictResolution[] }> {
    try {
        // Verificar e atualizar a sessão do Supabase antes de fazer operações
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error("Sessão do Supabase não encontrada. Por favor, faça login novamente.");
        }

        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        // Usar o ID da sessão ativa do Supabase
        const activeUserId = session.user.id;

        // 1. Apagar tudo do banco local
        console.log("[SYNC] Limpando banco local...");
        await database.execAsync(`
            DELETE FROM habit_records;
            DELETE FROM affirmations;
            DELETE FROM reasons;
            DELETE FROM habits;
        `);
        console.log("[SYNC] Banco local limpo");

        // 2. Criar novo mapeamento vazio
        const mapping: SyncMapping = {
            habits: {},
            habitRecords: {},
            affirmations: {},
            reasons: {},
        };

        // 3. Baixar tudo da nuvem
        // 3.1. Baixar Habits
        const { data: cloudHabits, error: habitsError } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', activeUserId)
            .order('created_at', { ascending: true });

        if (habitsError) throw habitsError;

        console.log(`[SYNC] Baixando ${cloudHabits?.length || 0} hábitos da nuvem`);

        for (const cloudHabit of (cloudHabits || []) as any[]) {
            const habit = cloudHabit as any;
            try {
                const statement = await database.prepareAsync(`
                    INSERT INTO habits (
                        name, cover, color, last_relapse_date,
                        daily_spent_time, daily_spent_money, default_currency,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const result = await statement.executeAsync([
                    habit.name,
                    habit.cover || null,
                    habit.color || null,
                    habit.last_relapse_date || null,
                    habit.daily_spent_time || 0,
                    habit.daily_spent_money || 0,
                    habit.default_currency || 'KZ',
                    habit.created_at,
                    habit.updated_at,
                ]);

                const localId = result.lastInsertRowId;
                mapping.habits[localId] = habit.id;
                console.log(`[SYNC] Habit ${habit.id} -> ${localId} baixado`);
            } catch (error) {
                console.error(`[SYNC] Erro ao inserir hábito ${habit.id} (${habit.name}):`, error);
                throw error;
            }
        }

        // 3.2. Baixar Habit Records
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudRecords } = await supabase
                .from('habit_records')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: true });

            for (const cloudRecord of (cloudRecords || []) as any[]) {
                const record = cloudRecord as any;
                try {
                    const statement = await database.prepareAsync(`
                        INSERT INTO habit_records (
                            habit_id, title, note, date_time, is_reset,
                            time_spent, money_spent, currency,
                            created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    const result = await statement.executeAsync([
                        parseInt(localHabitId),
                        record.title || null,
                        record.note || null,
                        record.date_time,
                        record.is_reset ? 1 : 0,
                        record.time_spent || null,
                        record.money_spent || null,
                        record.currency || null,
                        record.created_at,
                        record.updated_at,
                    ]);

                    const localId = result.lastInsertRowId;
                    mapping.habitRecords[localId] = record.id;
                } catch (error) {
                    console.error(`[SYNC] Erro ao inserir habit_record ${record.id}:`, error);
                    throw error;
                }
            }
        }

        // 3.3. Baixar Affirmations
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudAffirmations } = await supabase
                .from('affirmations')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: true });

            for (const cloudAffirmation of (cloudAffirmations || []) as any[]) {
                const affirmation = cloudAffirmation as any;
                const statement = await database.prepareAsync(`
                    INSERT INTO affirmations (habit_id, text, created_at)
                    VALUES (?, ?, ?)
                `);

                const result = await statement.executeAsync([
                    parseInt(localHabitId),
                    affirmation.text,
                    affirmation.created_at,
                ]);

                const localId = result.lastInsertRowId;
                mapping.affirmations[localId] = affirmation.id;
            }
        }

        // 3.4. Baixar Reasons
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudReasons } = await supabase
                .from('reasons')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: true });

            for (const cloudReason of (cloudReasons || []) as any[]) {
                const reason = cloudReason as any;
                const statement = await database.prepareAsync(`
                    INSERT INTO reasons (habit_id, text, created_at)
                    VALUES (?, ?, ?)
                `);

                const result = await statement.executeAsync([
                    parseInt(localHabitId),
                    reason.text,
                    reason.created_at,
                ]);

                const localId = result.lastInsertRowId;
                mapping.reasons[localId] = reason.id;
            }
        }

        await saveSyncMapping(mapping);
        
        console.log(`[SYNC] Download concluído. Mapeamento salvo:`, {
            habits: Object.keys(mapping.habits).length,
            records: Object.keys(mapping.habitRecords).length,
            affirmations: Object.keys(mapping.affirmations).length,
            reasons: Object.keys(mapping.reasons).length,
        });

        console.log(`[SYNC] Download bem-sucedido: ${Object.keys(mapping.habits).length} hábitos, ${Object.keys(mapping.habitRecords).length} registros, ${Object.keys(mapping.affirmations).length} afirmações, ${Object.keys(mapping.reasons).length} razões`);

        return { success: true, conflicts: [] };
    } catch (error) {
        console.error("Erro ao fazer download da nuvem:", error);
        throw error;
    }
}

// Sincronização bidirecional com resolução de conflitos e tratamento de hábitos apagados
export async function syncData(
    database: SQLiteDatabase,
    conflictResolver?: (conflicts: ConflictResolution[]) => Promise<ConflictResolution[]>
): Promise<{ success: boolean; uploaded: number; downloaded: number; conflicts: ConflictResolution[] }> {
    try {
        // Verificar e atualizar a sessão do Supabase antes de fazer operações
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error("Sessão do Supabase não encontrada. Por favor, faça login novamente.");
        }

        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        // Garantir que o user_id da sessão corresponde ao user.id
        const activeUserId = session.user.id;

        const mapping = await getSyncMapping();
        const conflicts: ConflictResolution[] = [];

        // 1. Obter dados locais e da nuvem
        const localHabits = await database.getAllAsync(`
            SELECT * FROM habits ORDER BY updated_at DESC
        `);

        const { data: cloudHabits } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', activeUserId)
            .order('updated_at', { ascending: false });

        // 2. Identificar hábitos locais que não existem mais (foram apagados)
        const localHabitIds = new Set((localHabits as any[]).map((h: any) => h.id));
        const mappedLocalIds = new Set(Object.keys(mapping.habits).map(k => parseInt(k)));
        
        // Hábitos que estavam mapeados mas não existem mais localmente
        for (const localIdStr of Object.keys(mapping.habits)) {
            const localId = parseInt(localIdStr);
            if (!localHabitIds.has(localId)) {
                // Hábito foi apagado localmente - remover da nuvem
                const cloudId = mapping.habits[localId];
                if (cloudId) {
                    // Deletar registros dependentes
                    await supabase
                        .from('habit_records')
                        .delete()
                        .eq('habit_id', cloudId);
                    
                    await supabase
                        .from('affirmations')
                        .delete()
                        .eq('habit_id', cloudId);
                    
                    await supabase
                        .from('reasons')
                        .delete()
                        .eq('habit_id', cloudId);
                    
                    // Deletar hábito
                    await supabase
                        .from('habits')
                        .delete()
                        .eq('id', cloudId);
                    
                    // Remover do mapeamento
                    delete mapping.habits[localId];
                }
            }
        }

        // 3. Identificar hábitos na nuvem que não existem mais (foram apagados)
        const cloudHabitIds = new Set(((cloudHabits || []) as any[]).map((h: any) => h.id));
        const mappedCloudIds = new Set(Object.values(mapping.habits));
        
        // Hábitos que estavam mapeados mas não existem mais na nuvem
        for (const [localIdStr, cloudId] of Object.entries(mapping.habits)) {
            const localId = parseInt(localIdStr);
            if (!cloudHabitIds.has(cloudId) && localHabitIds.has(localId)) {
                // Hábito foi apagado na nuvem mas existe localmente - remover localmente
                await database.execAsync(`
                    DELETE FROM habit_records WHERE habit_id = ${localId};
                    DELETE FROM affirmations WHERE habit_id = ${localId};
                    DELETE FROM reasons WHERE habit_id = ${localId};
                    DELETE FROM habits WHERE id = ${localId};
                `);
                
                // Remover do mapeamento
                delete mapping.habits[localId];
            }
        }

        // 4. Sincronizar hábitos existentes (upload)
        for (const habit of localHabits as any[]) {
            const h = habit as any;
            const cloudId = mapping.habits[h.id];
            
            if (cloudId) {
                // Habit já existe na nuvem - verificar conflito
                const cloudHabit = ((cloudHabits || []) as any[]).find((ch: any) => ch.id === cloudId);

                if (cloudHabit) {
                    const localDate = new Date(h.updated_at);
                    const cloudDate = new Date((cloudHabit as any).updated_at);
                    
                    if (localDate > cloudDate) {
                        // Local é mais recente - atualizar nuvem
                        await supabase
                            .from('habits')
                            .update(convertHabitToCloud(h))
                            .eq('id', cloudId);
                    } else if (cloudDate > localDate) {
                        // Nuvem é mais recente - conflito
                        conflicts.push({
                            habitId: h.id,
                            localUpdatedAt: h.updated_at,
                            cloudUpdatedAt: (cloudHabit as any).updated_at,
                            action: 'cloud',
                        });
                    }
                }
            } else {
                // Habit novo - criar na nuvem
                const { data, error } = await supabase
                    .from('habits')
                    .insert({
                        ...convertHabitToCloud(h),
                        user_id: activeUserId,
                    })
                    .select('id')
                    .single();

                if (data && !error) {
                    mapping.habits[h.id] = (data as any).id;
                }
            }
        }

        // 5. Sincronizar hábitos da nuvem que não existem localmente (download)
        for (const cloudHabit of (cloudHabits || []) as any[]) {
            const habit = cloudHabit as any;
            const localIdKey = Object.keys(mapping.habits).find(
                key => mapping.habits[parseInt(key)] === habit.id
            );

            if (!localIdKey) {
                // Habit novo na nuvem - criar localmente
                const statement = await database.prepareAsync(`
                    INSERT INTO habits (
                        name, cover, color, last_relapse_date,
                        daily_spent_time, daily_spent_money, default_currency,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const result = await statement.executeAsync([
                    habit.name,
                    habit.cover || null,
                    habit.color || null,
                    habit.last_relapse_date || null,
                    habit.daily_spent_time || 0,
                    habit.daily_spent_money || 0,
                    habit.default_currency || 'KZ',
                    habit.created_at,
                    habit.updated_at,
                ]);

                const localId = result.lastInsertRowId;
                mapping.habits[localId] = habit.id;
            }
        }

        // 6. Sincronizar Habit Records
        // 6.1. Upload records locais
        const localRecords = await database.getAllAsync(`
            SELECT * FROM habit_records ORDER BY updated_at DESC
        `);

        for (const record of localRecords as any[]) {
            const r = record as any;
            const cloudHabitId = mapping.habits[r.habit_id];
            if (!cloudHabitId) continue;

            const cloudId = mapping.habitRecords[r.id];
            
            if (cloudId) {
                const { data: cloudRecord } = await supabase
                    .from('habit_records')
                    .select('updated_at')
                    .eq('id', cloudId)
                    .single();

                if (cloudRecord) {
                    const localDate = new Date(r.updated_at);
                    const cloudDate = new Date((cloudRecord as any).updated_at);
                    
                    if (localDate > cloudDate) {
                        await supabase
                            .from('habit_records')
                            .update(convertHabitRecordToCloud(r))
                            .eq('id', cloudId);
                    }
                }
            } else {
                const { data, error } = await supabase
                    .from('habit_records')
                    .insert({
                        ...convertHabitRecordToCloud(r),
                        habit_id: cloudHabitId,
                    })
                    .select('id')
                    .single();

                if (data && !error) {
                    mapping.habitRecords[r.id] = (data as any).id;
                }
            }
        }

        // 6.2. Remover records que não existem mais localmente
        const localRecordIds = new Set((localRecords as any[]).map((r: any) => r.id));
        for (const [localRecordIdStr, cloudRecordId] of Object.entries(mapping.habitRecords)) {
            const localRecordId = parseInt(localRecordIdStr);
            if (!localRecordIds.has(localRecordId)) {
                await supabase
                    .from('habit_records')
                    .delete()
                    .eq('id', cloudRecordId);
                delete mapping.habitRecords[localRecordId];
            }
        }

        // 6.3. Download records da nuvem
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudRecords } = await supabase
                .from('habit_records')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('updated_at', { ascending: false });

            for (const cloudRecord of (cloudRecords || []) as any[]) {
                const record = cloudRecord as any;
                const localRecordId = Object.keys(mapping.habitRecords).find(
                    key => mapping.habitRecords[parseInt(key)] === record.id
                );

                if (!localRecordId) {
                    const statement = await database.prepareAsync(`
                        INSERT INTO habit_records (
                            habit_id, title, note, date_time, is_reset,
                            time_spent, money_spent, currency,
                            created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    const result = await statement.executeAsync([
                        parseInt(localHabitId),
                        record.title || null,
                        record.note || null,
                        record.date_time,
                        record.is_reset ? 1 : 0,
                        record.time_spent || null,
                        record.money_spent || null,
                        record.currency || null,
                        record.created_at,
                        record.updated_at,
                    ]);

                    const localId = result.lastInsertRowId;
                    mapping.habitRecords[localId] = record.id;
                }
            }
        }

        // 7. Sincronizar Affirmations (similar aos records)
        const localAffirmations = await database.getAllAsync(`
            SELECT * FROM affirmations ORDER BY created_at DESC
        `);

        for (const affirmation of localAffirmations as any[]) {
            const a = affirmation as any;
            const cloudHabitId = mapping.habits[a.habit_id];
            if (!cloudHabitId) continue;

            const cloudId = mapping.affirmations[a.id];
            
            if (!cloudId) {
                const { data: existing } = await supabase
                    .from('affirmations')
                    .select('id')
                    .eq('habit_id', cloudHabitId)
                    .eq('text', a.text)
                    .single();

                if (!existing) {
                    const { data, error } = await supabase
                        .from('affirmations')
                        .insert({
                            ...convertAffirmationToCloud(a),
                            habit_id: cloudHabitId,
                        })
                        .select('id')
                        .single();

                    if (data && !error) {
                        mapping.affirmations[a.id] = (data as any).id;
                    }
                }
            }
        }

        // Remover affirmations que não existem mais localmente
        const localAffirmationIds = new Set((localAffirmations as any[]).map((a: any) => a.id));
        for (const [localAffirmationIdStr, cloudAffirmationId] of Object.entries(mapping.affirmations)) {
            const localAffirmationId = parseInt(localAffirmationIdStr);
            if (!localAffirmationIds.has(localAffirmationId)) {
                await supabase
                    .from('affirmations')
                    .delete()
                    .eq('id', cloudAffirmationId);
                delete mapping.affirmations[localAffirmationId];
            }
        }

        // Download affirmations da nuvem
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudAffirmations } = await supabase
                .from('affirmations')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: false });

            for (const cloudAffirmation of (cloudAffirmations || []) as any[]) {
                const affirmation = cloudAffirmation as any;
                const localAffirmationId = Object.keys(mapping.affirmations).find(
                    key => mapping.affirmations[parseInt(key)] === affirmation.id
                );

                if (!localAffirmationId) {
                    const existing = await database.getFirstAsync(`
                        SELECT id FROM affirmations
                        WHERE habit_id = ? AND text = ?
                    `, [parseInt(localHabitId), affirmation.text]);

                    if (!existing) {
                        const statement = await database.prepareAsync(`
                            INSERT INTO affirmations (habit_id, text, created_at)
                            VALUES (?, ?, ?)
                        `);

                        const result = await statement.executeAsync([
                            parseInt(localHabitId),
                            affirmation.text,
                            affirmation.created_at,
                        ]);

                        const localId = result.lastInsertRowId;
                        mapping.affirmations[localId] = affirmation.id;
                    }
                }
            }
        }

        // 8. Sincronizar Reasons (similar aos records)
        const localReasons = await database.getAllAsync(`
            SELECT * FROM reasons ORDER BY created_at DESC
        `);

        for (const reason of localReasons as any[]) {
            const r = reason as any;
            const cloudHabitId = mapping.habits[r.habit_id];
            if (!cloudHabitId) continue;

            const cloudId = mapping.reasons[r.id];
            
            if (!cloudId) {
                const { data: existing } = await supabase
                    .from('reasons')
                    .select('id')
                    .eq('habit_id', cloudHabitId)
                    .eq('text', r.text)
                    .single();

                if (!existing) {
                    const { data, error } = await supabase
                        .from('reasons')
                        .insert({
                            ...convertReasonToCloud(r),
                            habit_id: cloudHabitId,
                        })
                        .select('id')
                        .single();

                    if (data && !error) {
                        mapping.reasons[r.id] = (data as any).id;
                    }
                }
            }
        }

        // Remover reasons que não existem mais localmente
        const localReasonIds = new Set((localReasons as any[]).map((r: any) => r.id));
        for (const [localReasonIdStr, cloudReasonId] of Object.entries(mapping.reasons)) {
            const localReasonId = parseInt(localReasonIdStr);
            if (!localReasonIds.has(localReasonId)) {
                await supabase
                    .from('reasons')
                    .delete()
                    .eq('id', cloudReasonId);
                delete mapping.reasons[localReasonId];
            }
        }

        // Download reasons da nuvem
        for (const [localHabitId, cloudHabitId] of Object.entries(mapping.habits)) {
            const { data: cloudReasons } = await supabase
                .from('reasons')
                .select('*')
                .eq('habit_id', cloudHabitId)
                .order('created_at', { ascending: false });

            for (const cloudReason of (cloudReasons || []) as any[]) {
                const reason = cloudReason as any;
                const localReasonId = Object.keys(mapping.reasons).find(
                    key => mapping.reasons[parseInt(key)] === reason.id
                );

                if (!localReasonId) {
                    const existing = await database.getFirstAsync(`
                        SELECT id FROM reasons
                        WHERE habit_id = ? AND text = ?
                    `, [parseInt(localHabitId), reason.text]);

                    if (!existing) {
                        const statement = await database.prepareAsync(`
                            INSERT INTO reasons (habit_id, text, created_at)
                            VALUES (?, ?, ?)
                        `);

                        const result = await statement.executeAsync([
                            parseInt(localHabitId),
                            reason.text,
                            reason.created_at,
                        ]);

                        const localId = result.lastInsertRowId;
                        mapping.reasons[localId] = reason.id;
                    }
                }
            }
        }

        await saveSyncMapping(mapping);

        // Resolver conflitos se houver
        let resolvedConflicts: ConflictResolution[] = [];
        if (conflicts.length > 0 && conflictResolver) {
            resolvedConflicts = await conflictResolver(conflicts);
            
            // Aplicar resoluções
            for (const conflict of resolvedConflicts) {
                if (conflict.action === 'cloud') {
                    // Baixar versão da nuvem
                    const cloudHabit = ((cloudHabits || []) as any[]).find((h: any) => 
                        Object.values(mapping.habits).includes(h.id) &&
                        Object.keys(mapping.habits).find(k => mapping.habits[parseInt(k)] === h.id) === conflict.habitId.toString()
                    );
                    
                    if (cloudHabit) {
                        const habit = cloudHabit as any;
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
                            $id: conflict.habitId,
                            $name: habit.name,
                            $cover: habit.cover || null,
                            $color: habit.color || null,
                            $last_relapse_date: habit.last_relapse_date || null,
                            $daily_spent_time: habit.daily_spent_time || 0,
                            $daily_spent_money: habit.daily_spent_money || 0,
                            $default_currency: habit.default_currency || 'KZ',
                            $updated_at: habit.updated_at,
                        });
                    }
                } else if (conflict.action === 'local') {
                    // Manter versão local e fazer upload
                    const localHabit = (localHabits as any[]).find((h: any) => h.id === conflict.habitId);
                    if (localHabit) {
                        const h = localHabit as any;
                        const cloudId = mapping.habits[h.id];
                        if (cloudId) {
                            await supabase
                                .from('habits')
                                .update(convertHabitToCloud(h))
                                .eq('id', cloudId);
                        }
                    }
                }
            }
        }

        return {
            success: true,
            uploaded: localHabits.length,
            downloaded: (cloudHabits || []).length,
            conflicts: resolvedConflicts.length > 0 ? resolvedConflicts : conflicts,
        };
    } catch (error) {
        console.error("Erro na sincronização:", error);
        throw error;
    }
}

