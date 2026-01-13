import * as SQLite from 'expo-sqlite';

// Open the database (sync for ease of use in logic files)
export const db = SQLite.openDatabaseSync('pneurelief.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL; -- High-performance mode for many writes
    CREATE TABLE IF NOT EXISTS raw_packets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patch_id TEXT,
      pressure REAL,
      timestamp TEXT
    );
  `);

  console.log('Internal Database created.')
};