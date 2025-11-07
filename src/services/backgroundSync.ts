import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadSensorData, SensorReading } from './api';

// Storage keys
const UNSYNCED_DATA_KEY = 'unsyncedSensorReadings';
const LAST_SYNC_KEY = 'lastSyncTimestamp';

// Configuration
const SYNC_INTERVAL_MS = 3600000; // 1 hour = 3600000 ms
const MAX_RETRIES = 3;

interface SyncResult {
  success: boolean;
  readingsCount: number;
  aggregatesCreated?: number;
  error?: Error;
}

/**
 * Add sensor readings to local storage for later syncing
 * Call this function when you receive new sensor data from ESP32
 * 
 * @example
 * const newReading = {
 *   patch_id: 'bottom_left',
 *   pressure: 42.5,
 *   timestamp: new Date().toISOString()
 * };
 * await addReadingsToLocalQueue([newReading]);
 */
export async function addReadingsToLocalQueue(
  newReadings: SensorReading[]
): Promise<void> {
  try {
    // Get existing unsynced data
    const existingData = await AsyncStorage.getItem(UNSYNCED_DATA_KEY);
    const existingReadings: SensorReading[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Append new readings
    const updatedReadings = [...existingReadings, ...newReadings];

    // Save back to storage
    await AsyncStorage.setItem(
      UNSYNCED_DATA_KEY,
      JSON.stringify(updatedReadings)
    );

    console.log(
      `📦 Added ${newReadings.length} readings to local queue. Total: ${updatedReadings.length}`
    );
  } catch (error) {
    console.error('❌ Error adding readings to local queue:', error);
    throw error;
  }
}

/**
 * Sync local sensor data to backend
 * This function should be called periodically (every 1 hour)
 * 
 * @param userId - User ID to associate with the readings
 * @param forceSync - Force sync even if there are no readings
 * @returns SyncResult with success status and details
 */
export async function syncLocalDataToBackend(
  userId: string,
  forceSync: boolean = false
): Promise<SyncResult> {
  try {
    console.log('🔄 Starting background sync...');

    // Get unsynced readings from local storage
    const localData = await AsyncStorage.getItem(UNSYNCED_DATA_KEY);

    if (!localData && !forceSync) {
      console.log('ℹ️ No data to sync');
      return {
        success: true,
        readingsCount: 0,
      };
    }

    const readings: SensorReading[] = localData ? JSON.parse(localData) : [];

    if (readings.length === 0 && !forceSync) {
      console.log('ℹ️ No readings to sync');
      return {
        success: true,
        readingsCount: 0,
      };
    }

    // Upload to backend
    console.log(`📤 Uploading ${readings.length} readings to backend...`);
    const result = await uploadSensorData(userId, readings);

    // Clear local storage after successful sync
    await AsyncStorage.removeItem(UNSYNCED_DATA_KEY);

    // Update last sync timestamp
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

    console.log(
      `✅ Sync successful! Uploaded ${readings.length} readings, created ${result.aggregates_created} aggregates`
    );

    return {
      success: true,
      readingsCount: readings.length,
      aggregatesCreated: result.aggregates_created,
    };
  } catch (error) {
    console.error('❌ Sync failed:', error);
    // Keep data in local storage for next attempt
    return {
      success: false,
      readingsCount: 0,
      error: error as Error,
    };
  }
}

/**
 * Get the last sync timestamp
 */
export async function getLastSyncTime(): Promise<Date | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('❌ Error getting last sync time:', error);
    return null;
  }
}

/**
 * Get the count of unsynced readings
 */
export async function getUnsyncedCount(): Promise<number> {
  try {
    const localData = await AsyncStorage.getItem(UNSYNCED_DATA_KEY);
    if (!localData) return 0;

    const readings: SensorReading[] = JSON.parse(localData);
    return readings.length;
  } catch (error) {
    console.error('❌ Error getting unsynced count:', error);
    return 0;
  }
}

/**
 * Setup periodic background sync
 * Call this in your App.tsx or main component
 * 
 * @param userId - User ID to sync data for
 * @param intervalMs - Sync interval in milliseconds (default: 1 hour)
 * @returns Cleanup function to stop the sync interval
 * 
 * @example
 * // In App.tsx or main component
 * useEffect(() => {
 *   const cleanup = setupBackgroundSync('user123', 3600000); // 1 hour
 *   return cleanup; // Stop sync on unmount
 * }, []);
 */
export function setupBackgroundSync(
  userId: string,
  intervalMs: number = SYNC_INTERVAL_MS
): () => void {
  console.log(`⏰ Setting up background sync (interval: ${intervalMs / 1000}s)`);

  // Initial sync on setup
  syncLocalDataToBackend(userId);

  // Set up periodic sync
  const intervalId = setInterval(() => {
    syncLocalDataToBackend(userId);
  }, intervalMs);

  // Return cleanup function
  return () => {
    console.log('🛑 Stopping background sync');
    clearInterval(intervalId);
  };
}

/**
 * Manual sync trigger
 * Use this for a "Sync Now" button in your settings
 */
export async function manualSync(userId: string): Promise<SyncResult> {
  console.log('🔄 Manual sync triggered');
  return await syncLocalDataToBackend(userId, true);
}

/**
 * Clear all local unsynced data (use with caution!)
 * Useful for debugging or if sync is permanently failing
 */
export async function clearLocalData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(UNSYNCED_DATA_KEY);
    console.log('🗑️ Cleared all local unsynced data');
  } catch (error) {
    console.error('❌ Error clearing local data:', error);
    throw error;
  }
}
