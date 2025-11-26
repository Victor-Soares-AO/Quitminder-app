import { type SQLiteDatabase } from "expo-sqlite";

export async function migrate(database: SQLiteDatabase) {
  return database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover TEXT,
      color TEXT,
      last_relapse_date TEXT,
      daily_spent_time INTEGER,
      daily_spent_money REAL,
      default_currency TEXT NOT NULL DEFAULT 'KZ',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS habit_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      title TEXT,
      note TEXT,
      date_time TEXT,
      is_reset INTEGER DEFAULT 0,
      time_spent INTEGER,
      money_spent REAL,
      currency TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_habit_records_habits
      FOREIGN KEY (habit_id) REFERENCES habits(id)
      ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS affirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_affirmations_habits
      FOREIGN KEY (habit_id) REFERENCES habits(id)
      ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_affirmation_per_habit
    ON affirmations (habit_id, text);

    CREATE TABLE IF NOT EXISTS reasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_reasons_habits
      FOREIGN KEY (habit_id) REFERENCES habits(id)
      ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_reason_per_habit
    ON reasons (habit_id, text);
  `);
}
