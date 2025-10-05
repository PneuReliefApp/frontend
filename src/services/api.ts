import API_URL from "../config";
// Or later if you move to .env → import { BACKEND_URL as API_URL } from "@env";

export async function checkConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    console.log(`🌐 Checking backend connection: ${API_URL}/`);

    const res = await fetch(`${API_URL}/`, { signal: controller.signal });
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