import API_URL from "../config";

export async function checkConnection(): Promise<boolean> {
  try {
    console.log(`${API_URL}`)
    const res = await fetch(`${API_URL}/`);
    console.log(res);
    return res.ok;
  } catch (err) {
    return false;
  }
}