import { BACKEND_URL as API_URL } from "@env";

// ============================================================================
// TYPES
// ============================================================================

export interface SensorReading {
  patch_id: string;
  pressure: number;
  timestamp: string; // ISO 8601 format
}

export interface SensorUploadRequest {
  user_id: string;
  readings: SensorReading[];
}

export interface SensorUploadResponse {
  status: string;
  rows_inserted: number;
}

export interface PressureAggregate {
  id: number;
  user_id: string;
  patch_id: string;
  avg_pressure: number;
  max_pressure: number;
  min_pressure: number;
  start_time: string;
  end_time: string;
  sample_count: number;
  created_at: string;
}

export interface AggregatesResponse {
  user_id: string;
  aggregates: PressureAggregate[];
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    console.log(`🌐 Checking backend connection: ${API_URL}`);

    const res = await fetch(`${API_URL}`, { signal: controller.signal });
    clearTimeout(timeout);

    console.log(`✅ Response status: ${res.status}`);

    // Optionally log JSON response if available
    try {
      const data = await res.json();
      console.log("📦 Response payload:", data);
    } catch {
      console.log("ℹ️ No JSON body or not applicable.");
    }

    return res.ok;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error("⏱️ Request to backend timed out");
    } else {
      console.error("❌ Failed to reach backend:", err.message || err);
    }
    return false;
  }
}

// ============================================================================
// SENSOR DATA API
// ============================================================================

/**
 * Upload batch sensor readings to backend
 * This should be called every 1 hr to sync local data
 */
export async function uploadSensorData(
  userId: string,
  readings: SensorReading[]
): Promise<SensorUploadResponse> {
  try {
    console.log(`Uploading ${readings.length} sensor readings for user ${userId}`);

    const response = await fetch(`${API_URL}/sensor-data/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        readings: readings,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`${API_URL}/sensor-data/upload`);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const data: SensorUploadResponse = await response.json();
    console.log(`Upload successful: ${data.rows_inserted} rows saved to Supabase`);
    return data;
  } catch (error: any) {
    console.error("Error uploading sensor data:", error.message || error);
    throw error;
  }
}

/**
 * Get processed pressure aggregates for a user
 * Used in Reports screen to display historical data
 */
export async function getUserAggregates(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<AggregatesResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const url = `${API_URL}/sensor-data/aggregates/${userId}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    console.log(`📊 Fetching aggregates for user ${userId}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
    }

    const data: AggregatesResponse = await response.json();
    console.log(`✅ Fetched ${data.aggregates.length} aggregates`);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching user aggregates:", error.message || error);
    throw error;
  }
}

// ============================================================================
// PATIENTS API
// ============================================================================

export interface Patient {
  id: string;
  name: string;
  // Add other patient fields as needed
}

export async function getPatients(): Promise<Patient[]> {
  try {
    console.log("👥 Fetching patients list");

    const response = await fetch(`${API_URL}/patients/patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
    }

    const data: Patient[] = await response.json();
    console.log(`✅ Fetched ${data.length} patients`);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching patients:", error.message || error);
    throw error;
  }
}