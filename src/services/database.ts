import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Database instance (initialized lazily)
let db: SQLite.SQLiteDatabase | null = null;

// Get or create database instance
export const getDatabase = () => {
  if (!db) {
    try {
      db = SQLite.openDatabaseSync('pneurelief.db');
    } catch (error) {
      console.error('Failed to open database:', error);
      throw error;
    }
  }
  return db;
};

export const initDatabase = () => {
  try {
    const database = getDatabase();

    // Skip WAL mode on web as it's not supported
    if (Platform.OS !== 'web') {
      database.execSync('PRAGMA journal_mode = WAL;');
    }

    database.execSync(`
      CREATE TABLE IF NOT EXISTS raw_packets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patch_id TEXT,
        pressure REAL,
        timestamp TEXT
      );
    `);

    console.log('Internal Database created.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // On web, SQLite might not be fully supported, so we'll log but not crash
    if (Platform.OS === 'web') {
      console.warn('SQLite not fully supported on web, some features may be limited');
    } else {
      throw error;
    }
  }
};