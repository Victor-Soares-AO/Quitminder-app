export type HabitCreateDTO = {
  name: string;
  cover: string;
  color: string;
  last_relapse_date: Date;
  daily_spent_time: number;
  daily_spent_money: number;
  default_currency: string;
};

export type HabitResponseDTO = {
  id: number;
  name: string;
  cover: string;
  color: string;
  last_relapse_date: string;
  daily_spent_time: number;
  daily_spent_money: number;
  default_currency: string;
  created_at: string;
  updated_at: string;
};
