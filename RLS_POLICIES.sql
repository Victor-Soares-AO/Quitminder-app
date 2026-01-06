-- Políticas RLS para o QuitMinder
-- Execute estas queries no Supabase SQL Editor

-- 1. HABITS - Permitir que usuários gerenciem apenas seus próprios hábitos
-- Primeiro, deletar políticas antigas se existirem
DROP POLICY IF EXISTS "User can manage own habits" ON habits;

-- Criar política para INSERT
CREATE POLICY "Users can insert own habits"
ON habits
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Criar política para SELECT
CREATE POLICY "Users can view own habits"
ON habits
FOR SELECT
USING (user_id = auth.uid());

-- Criar política para UPDATE
CREATE POLICY "Users can update own habits"
ON habits
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Criar política para DELETE
CREATE POLICY "Users can delete own habits"
ON habits
FOR DELETE
USING (user_id = auth.uid());

-- 2. HABIT_RECORDS - Permitir que usuários gerenciem registros de seus próprios hábitos
DROP POLICY IF EXISTS "User can manage own habit records" ON habit_records;

CREATE POLICY "Users can insert own habit records"
ON habit_records
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = habit_records.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view own habit records"
ON habit_records
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = habit_records.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update own habit records"
ON habit_records
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = habit_records.habit_id
        AND habits.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = habit_records.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete own habit records"
ON habit_records
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = habit_records.habit_id
        AND habits.user_id = auth.uid()
    )
);

-- 3. AFFIRMATIONS - Permitir que usuários gerenciem afirmações de seus próprios hábitos
DROP POLICY IF EXISTS "User can manage own affirmations" ON affirmations;

CREATE POLICY "Users can insert own affirmations"
ON affirmations
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = affirmations.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view own affirmations"
ON affirmations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = affirmations.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update own affirmations"
ON affirmations
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = affirmations.habit_id
        AND habits.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = affirmations.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete own affirmations"
ON affirmations
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = affirmations.habit_id
        AND habits.user_id = auth.uid()
    )
);

-- 4. REASONS - Permitir que usuários gerenciem razões de seus próprios hábitos
DROP POLICY IF EXISTS "User can manage own reasons" ON reasons;

CREATE POLICY "Users can insert own reasons"
ON reasons
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = reasons.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view own reasons"
ON reasons
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = reasons.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update own reasons"
ON reasons
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = reasons.habit_id
        AND habits.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = reasons.habit_id
        AND habits.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete own reasons"
ON reasons
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM habits
        WHERE habits.id = reasons.habit_id
        AND habits.user_id = auth.uid()
    )
);

