import React, { createContext, useState, useContext, ReactNode } from "react";
import type { HabitResponseDTO } from "@/dtos/habit.dto";

type HabitContextData = {
    habit: HabitResponseDTO;
    setHabit: (habit: HabitResponseDTO) => void;
    clearHabit: () => void;
};

const HabitContext = createContext<HabitContextData | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {

    const [habit, setHabit] = useState<HabitResponseDTO>(null);

    function clearHabit() {
        setHabit(null);
    }

    return (
        <HabitContext.Provider value={{ habit, setHabit, clearHabit }}>
            {children}
        </HabitContext.Provider>
    );
}

export function useHabitContext() {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error("useHabitContext deve ser usado dentro de um HabitProvider");
    }
    return context;
}