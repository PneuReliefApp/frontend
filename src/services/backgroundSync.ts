import { db } from './database';
import { uploadSensorData, SensorReading } from './api';

// Configuration
const SYNC_INTERVAL_MS = 600000; // time in ms btwn sync to cloud

export interface SyncResult {
  success: boolean;
  readingsCount: number;
  error?: Error;
}

// Optimized Batch Insert for SQLite
export async function addReadingsToLocalQueue(newReadings: SensorReading[]): Promise<void> {
  try {
    await db.withTransactionAsync(async () => {
      for (const r of newReadings) {
        await db.runAsync(
          'INSERT INTO raw_packets (patch_id, pressure, timestamp) VALUES (?, ?, ?)',
          [r.patch_id, r.pressure, r.timestamp]
        );
      }
    });
    // Removed reference to 'updatedReadings' as SQLite doesn't need to keep the whole array in memory
    console.log(`SQLite: Added ${newReadings.length} readings to local database.`);
  } catch (error) {
    console.error('Error adding readings to local database:', error);
    throw error;
  }
}


// Sync local sensor data to backend
export async function syncLocalDataToBackend(userId: string): Promise<SyncResult> {
  try {
    console.log('Starting background sync...');

    // 1. Fetch unsynced rows from SQLite
    // 'rows' is defined here to fix the "Cannot find name 'rows'" error
    const rows = await db.getAllAsync<{ id: number; patch_id: string; pressure: number; timestamp: string }>(
      'SELECT * FROM raw_packets LIMIT 5000'
    );

    if (!rows || rows.length === 0) {
      console.log('No data to sync');
      return { success: true, readingsCount: 0 };
    }

    // 2. Map the database rows to the SensorReading type expected by api.ts
    const readings: SensorReading[] = rows.map((row) => ({
      patch_id: row.patch_id,
      pressure: row.pressure,
      timestamp: row.timestamp,
    }));

    // 3. Upload to backend (api.ts)
    console.log(`Uploading ${readings.length} readings to backend...`);
    const result = await uploadSensorData(userId, readings);

    // 4. PURGE: Use the 'rows' variable to find the last ID successfully sent
    const lastId = rows[rows.length - 1].id;
    await db.runAsync('DELETE FROM raw_packets WHERE id <= ?', [lastId]);

    console.log(`Sync successful! Purged local storage up to ID: ${lastId}`);

    return {
      success: true,
      readingsCount: readings.length
    };
  } catch (error: any) {
    console.error('Sync failed:', error);
    return {
      success: false,
      readingsCount: 0,
      error: error as Error,
    };
  }
}

// Setup periodic background sync
export function setupBackgroundSync(userId: string, intervalMs: number = SYNC_INTERVAL_MS): () => void {
  console.log(`Setting up background sync (interval: ${intervalMs / 1000}s)`);

  const intervalId = setInterval(() => {
    syncLocalDataToBackend(userId);
  }, intervalMs);

  return () => {
    console.log('Stopping background sync');
    clearInterval(intervalId);
  };
}

//Clear all local data
export async function clearLocalData(): Promise<void> {
  try {
    await db.runAsync('DELETE FROM raw_packets');
    console.log('SQLite: Cleared all local sensor data');
  } catch (error) {
    console.error('Error clearing local data:', error);
    throw error;
  }
}

// SIMULATION: TEST DATA
let simulationInterval: NodeJS.Timeout | null = null;

export const startDataSimulation = () => {
  if (simulationInterval) return;

  console.log("Starting 20Hz Data Simulation...");
  
  // Every 1 second, we generate 20 packets (to mimic 20Hz)
  simulationInterval = setInterval(async () => {
    const fakeBatch: SensorReading[] = [];
    
    for (let i = 0; i < 20; i++) {
      fakeBatch.push({
        patch_id: "Heel Pad (Red)",
        // Generate a random pressure value between 100 and 600
        pressure: Math.floor(Math.random() * (600 - 100 + 1)) + 100,
        timestamp: new Date().toISOString()
      });
    }

    // Push the batch of 20 to your SQLite logic
    await addReadingsToLocalQueue(fakeBatch);
  }, 1000); 
};

export const stopDataSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("Simulation Stopped.");
  }
};