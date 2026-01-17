import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import { Buffer } from "buffer";

// BLE Contract Constants
const DEVICE_NAME = "ESP32-PneuRelief";
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const SENSOR_CHAR_UUID = "12345678-1234-1234-1234-123456789001";
const CONTROL_CHAR_UUID = "12345678-1234-1234-1234-123456789002";
const STATUS_CHAR_UUID = "12345678-1234-1234-1234-123456789003";

// Command format: 4-byte hex encoding [section, inflate, deflate, pump]
export interface BLCommand {
  section: number; // 0-3
  inflate: boolean; // 0 or 1
  deflate: boolean; // 0 or 1
  pump: boolean; // 0 or 1
}

class BluetoothService {
  private manager: BleManager;
  private device: Device | null = null;
  private monitoringSubscription: any = null;
  private stateSubscription: any = null;
  private onReadingCallback: ((reading: number) => void) | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.manager = new BleManager();
  }

  /**
   * Request Bluetooth permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "ios") {
      return true;
    }

    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      try {
        if (apiLevel < 31) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ) {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          return (
            result["android.permission.BLUETOOTH_CONNECT"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result["android.permission.BLUETOOTH_SCAN"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result["android.permission.ACCESS_FINE_LOCATION"] ===
              PermissionsAndroid.RESULTS.GRANTED
          );
        }
      } catch (err) {
        console.warn("Bluetooth permission error:", err);
        return false;
      }
    }

    console.warn("Bluetooth permissions not granted");
    return false;
  }

  /**
   * Initialize Bluetooth and wait for it to be powered on
   */
  async initBluetooth(): Promise<boolean> {
    const granted = await this.requestPermissions();
    if (!granted) {
      console.warn("Bluetooth permission not granted");
      return false;
    }

    return new Promise((resolve) => {
      this.stateSubscription = this.manager.onStateChange((state) => {
        console.log("Bluetooth state:", state);
        if (state === "PoweredOn") {
          resolve(true);
        } else if (state === "PoweredOff") {
          Alert.alert(
            "Bluetooth is off",
            "Please turn on Bluetooth to connect to devices",
            [{ text: "OK" }]
          );
          resolve(false);
        }
      }, true);
    });
  }

  /**
   * Connect to the ESP32-PneuRelief device
   * @returns Promise that resolves when connected, or rejects on error
   */
  async connect(): Promise<void> {
    if (this.isConnected && this.device) {
      console.log("Already connected to device");
      return;
    }

    return new Promise((resolve, reject) => {
      console.log("Scanning for Bluetooth device:", DEVICE_NAME);

      this.manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          this.manager.stopDeviceScan();
          reject(error);
          return;
        }

        if (device?.name === DEVICE_NAME) {
          console.log("Found device:", device.name);
          this.manager.stopDeviceScan();

          try {
            const connectedDevice = await device.connect();
            this.device = connectedDevice;
            await connectedDevice.discoverAllServicesAndCharacteristics();

            // Setup disconnection handler
            this.manager.onDeviceDisconnected(connectedDevice.id, (error, device) => {
              if (error) {
                console.error("❌ Disconnection error:", error);
              }
              console.log("⚠️ Device disconnected:", device?.id);
              this.isConnected = false;
              this.device = null;
              this.stopMonitoring();

              // Attempt to reconnect
              if (device) {
                console.log("🔁 Attempting to reconnect...");
                device
                  .connect()
                  .then(() => {
                    console.log("✅ Reconnected successfully");
                    this.device = device;
                    this.isConnected = true;
                  })
                  .catch((err) => {
                    console.error("Reconnection failed:", err);
                  });
              }
            });

            this.isConnected = true;
            console.log("✅ Connected to device");
            resolve();
          } catch (err) {
            console.error("Connection error:", err);
            this.isConnected = false;
            this.device = null;
            reject(err);
          }
        }
      });
    });
  }

  /**
   * Start streaming sensor data
   * @param onReading Callback function that receives decoded sensor readings
   */
  async startStreaming(onReading: (reading: number) => void): Promise<void> {
    if (!this.device || !this.isConnected) {
      throw new Error("Device not connected. Call connect() first.");
    }

    this.onReadingCallback = onReading;

    try {
      // Read initial characteristic value
      const characteristic = await this.device.readCharacteristicForService(
        SERVICE_UUID,
        SENSOR_CHAR_UUID
      );
      console.log("Initial characteristic value:", characteristic.value);

      // Start monitoring
      this.monitoringSubscription = this.device.monitorCharacteristicForService(
        SERVICE_UUID,
        SENSOR_CHAR_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("❌ Sensor monitor error:", error);
            return;
          }

          if (characteristic?.value) {
            try {
              // Decode base64 to buffer, then to string, then parse as float
              const decoded = Buffer.from(
                characteristic.value,
                "base64"
              ).toString("utf8");
              const reading = parseFloat(decoded.trim());

              if (!isNaN(reading) && this.onReadingCallback) {
                this.onReadingCallback(reading);
              }
            } catch (e) {
              console.error("Failed to decode sensor data:", e);
            }
          }
        }
      );
    } catch (err) {
      console.error("Failed to start streaming:", err);
      throw err;
    }
  }

  /**
   * Stop streaming sensor data
   */
  stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.remove();
      this.monitoringSubscription = null;
    }
    this.onReadingCallback = null;
  }

  /**
   * Send a command to the device
   * @param cmd Command object with section, inflate, deflate, and pump flags
   */
  async sendCommand(cmd: BLCommand): Promise<void> {
    if (!this.device || !this.isConnected) {
      throw new Error("Device not connected. Call connect() first.");
    }

    try {
      // Create 4-byte buffer: [section, inflate, deflate, pump]
      const buffer = Buffer.alloc(4);
      buffer[0] = cmd.section; // section index (0-3)
      buffer[1] = cmd.inflate ? 1 : 0; // inflate flag
      buffer[2] = cmd.deflate ? 1 : 0; // deflate flag
      buffer[3] = cmd.pump ? 1 : 0; // pump flag

      // Convert to base64 for BLE transmission
      const base64Data = buffer.toString("base64");

      await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CONTROL_CHAR_UUID,
        base64Data
      );

      console.log(
        `[SENT] Command: section=${cmd.section}, inflate=${cmd.inflate}, deflate=${cmd.deflate}, pump=${cmd.pump}`
      );
    } catch (err) {
      console.error("❌ Failed to send command:", err);
      throw err;
    }
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    this.stopMonitoring();
    if (this.device) {
      try {
        await this.device.cancelConnection();
      } catch (err) {
        console.error("Error disconnecting:", err);
      }
      this.device = null;
    }
    this.isConnected = false;
  }

  /**
   * Check if device is connected
   */
  getConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopMonitoring();
    if (this.stateSubscription) {
      this.stateSubscription.remove();
      this.stateSubscription = null;
    }
    if (this.manager) {
      this.manager.destroy();
    }
  }
}

// Export singleton instance
export const bluetoothService = new BluetoothService();

// Export convenience functions that match the requested interface
export const connect = () => bluetoothService.connect();
export const startStreaming = (onReading: (reading: number) => void) =>
  bluetoothService.startStreaming(onReading);
export const sendCommand = (cmd: BLCommand) => bluetoothService.sendCommand(cmd);
export const initBluetooth = () => bluetoothService.initBluetooth();
export const disconnect = () => bluetoothService.disconnect();
export const getConnected = () => bluetoothService.getConnected();

// Keep backward compatibility exports (deprecated - use the new interface instead)
export const BLEInstance = {
  get manager() {
    return bluetoothService["manager"];
  },
};
export const requestBluetoothPermissions = () =>
  bluetoothService.requestPermissions();
