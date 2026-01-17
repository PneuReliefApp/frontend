import React, { useEffect, useState } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Switch,
  Menu,
  Chip,
  Button,
  Divider,
  Card,
  Avatar,
  useTheme,
  IconButton,
} from "react-native-paper";

import { checkConnection } from "../services/api";
import { supabase } from "../services/supabase_client";
import ThreeJSFootVisualization from "../components/ThreeJSFootVisualization";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import LivePressureGraph from "../graphs/live_pressure_graph";
import LivePositionGraph from "../graphs/live_position_graph";
import PressureGraph from "../components/SimplePressureGraph";
import {
  BLEInstance,
  requestBluetoothPermissions,
} from "../services/bluetooth";
import { Buffer } from "buffer";

export default function HomeScreen() {
  // ✅ Connection states
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null
  );
  const [bluetoothConnected, setBluetoothConnected] = useState<boolean | null>(
    null
  );
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(
    null
  );

  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Supabase data state
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = React.useState<boolean | null>(null);
  const [device, setDevice] = useState<any>();
  const [scannedDevices, setScannedDevices] = useState<any[]>([]);

  const [pressure, setPressure] = useState<number | null>(null);
  const [pressureReadings, setPressureReadings] = useState<number[]>([]);
  const maxPoints = 50;
  const [bluetoothState, setBluetoothState] = useState("Unknown");

  const manager = BLEInstance.manager;

  const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
  const PRESSURE_CHAR_UUID = "12345678-1234-5678-1234-56789abcdef1";
  const COMMAND_CHAR_UUID = "12345678-1234-5678-1234-56789abcdef2";

  const ESP32_NAME = "PneumaticSystem";

  // Check backend connection
  React.useEffect(() => {
    const testConnection = async () => {
      const ok = await checkConnection();
      setConnected(ok);
    };
    testConnection();
  }, []);

  // BLE functions (to be refactored into bluetooth.ts)
  const setupOnDeviceDisconnected = (deviceId: any) => {
    manager.onDeviceDisconnected(deviceId, (error: any, device: any) => {
      if (error) {
        console.error("❌ Disconnection error:", error);
      }
      console.log("⚠️ Device disconnected:", device?.id);
      setBluetoothConnected(false);

      if (device) {
        console.log("🔁 Attempting to reconnect...");
        device.connect().then(() => {
          setBluetoothConnected(true);
          console.log("✅ Reconnected successfully");
          startMonitoring(device);
        });
      }
    });
  };

  const startMonitoring = (connectedDevice: any) => {
    connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      PRESSURE_CHAR_UUID,
      (error: any, characteristic: any) => {
        if (error) {
          console.error("❌ Pressure monitor error:", error);
          return;
        }

        if (characteristic?.value) {
          try {
            const decoded = Buffer.from(
              characteristic.value,
              "base64"
            ).toString("utf8");
            const reading = parseFloat(decoded.trim());
            if (!isNaN(reading)) {
              setPressure(reading);
              setPressureReadings((prev) => {
                const updated = [...prev, reading];
                return updated.length > maxPoints
                  ? updated.slice(updated.length - maxPoints)
                  : updated;
              });
            }
          } catch (e) {
            console.error("Failed to decode pressure data:", e);
          }
        }
      }
    );
  };

  const scanAndConnect = () => {
    console.log("Scanning for bluetooth device");
    manager.startDeviceScan(null, null, async (error: any, device: any) => {
      if (error) {
        manager.stopDeviceScan();
        return;
      }
      if (device?.name === ESP32_NAME) {
        console.log("Found device: ", device.name);
        setBluetoothConnected(true);
        manager.stopDeviceScan();

        try {
          const connectedDevice = await device.connect();
          setDevice(connectedDevice);
          await connectedDevice.discoverAllServicesAndCharacteristics();

          setupOnDeviceDisconnected(connectedDevice.id);
          const characteristic =
            await connectedDevice.readCharacteristicForService(
              SERVICE_UUID,
              PRESSURE_CHAR_UUID
            );
          console.log("Characteristic value:", characteristic.value);
          startMonitoring(connectedDevice);
        } catch (err) {
          console.error("Connection error:", err);
          setBluetoothConnected(false);
        }
      } else {
        //   setBluetoothConnected(false);
      }
    });
  };

  const sendCommand = async (cmd: "INFLATE" | "DEFLATE") => {
    if (!device) {
      console.warn("No device connected");
      return;
    }

    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        COMMAND_CHAR_UUID,
        Buffer.from(cmd, "utf8").toString("base64")
      );
      console.log(`[SENT] Command sent: ${cmd}`);
    } catch (err) {
      console.error("❌ Failed to send command:", err);
    }
  };

  // --- Function to test Supabase ---
  const testSupabaseConnection = async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("patients")
        .select("*")
        .limit(10);
      
      if (error) {
        throw error;
      }

      console.log("Supabase connected. Status:", status, "Sample data:", data);
    
      setSupabaseConnected(true); // Assuming you renamed the state variable
      setPatients(data || []);
    } catch (error: any) { 
      console.error("Supabase connection failed:", error.message || error);
      setSupabaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // --- Function to add a test patient ---
  const addPatient = async () => {
    try {
      const { data, error } = await supabase
        .from("patients") // Your table name
        .insert([
          { 
            // name set to Patient # for now
            name: `Patient ${patients.length + 1}`,
            created_at: new Date().toISOString(), 
          }
        ])
        .select(); // Returns the inserted row

      if (error) throw error;

      console.log("Patient added to Supabase:", data);
      alert("Patient added successfully!");
      
      // Refresh list using your new Supabase test/fetch function
      await testSupabaseConnection(); 
    } catch (error: any) {
      console.error("Error adding patient:", error.message || error);
      alert("Failed to add patient to Supabase.");
    }
  };

  // --- Function to delete a patient ---
  const deletePatient = async (id: string, name: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("patients")
                .delete()
                .eq("id", id); // Matches the 'id' column with the passed variable

              if (error) throw error;

              console.log(`Deleted patient ${name} (${id})`);
              await testSupabaseConnection(); // Refresh list
            } catch (error: any) {
              console.error("Error deleting patient:", error.message || error);
              alert("Failed to delete patient.");
            }
          },
        },
      ]
    );
  };

  // --- Function to test backend connectivity ---
  const testBackendConnection = async () => {
    try {
      const ok = await checkConnection();
      setBackendConnected(ok);
    } catch (e) {
      console.error("Backend unreachable:", e);
      setBackendConnected(false);
    }
  };

  // --- Run all tests on component load ---
  useEffect(() => {
    const runAllTests = async () => {
      await testBackendConnection();
      await testSupabaseConnection();
    };
    runAllTests();

    const initBluetooth = async () => {
      console.log("init bluetooth");
      const granted = await requestBluetoothPermissions();
      if (!granted) {
        console.warn("Bluetooth permission not granted");
        return;
      } else {
        console.log("Bluetooth granted");
      }

      // const state = await manager.state(); // get current state
      // console.log("BT STATE:", state);
      // if (state !== "PoweredOn") {
      //   Alert.alert(
      //     "Bluetooth is off",
      //     "Please turn on Bluetooth to connect to devices",
      //     [{ text: "OK" }]
      //   );
      //   return;
      // }
      const subscription = manager.onStateChange((state: any) => {
        console.log("init bluetooth111");
        console.log(state);
        setBluetoothState(state);
        if (state === "PoweredOn") {
          scanAndConnect();
        } else {
          console.log("Bluetooth not on");
          Alert.alert(
            "Bluetooth is off",
            "Please turn on Bluetooth to connect to devices",
            [{ text: "OK" }]
          );
        }
      }, true);
      return () => subscription.remove();
    };
    initBluetooth();
  }, []);

  // --- Render UI ---
  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Card style={styles.welcomeCard} elevation={4}>
          <ImageBackground
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIpm4TIKo77tuSmYWg2jZcdEtjQOIsp3HMoQ&s",
            }}
            style={styles.welcomeBackground}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.welcomeContent}>
              <Avatar.Image
                size={80}
                source={{
                  uri: "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?semt=ais_hybrid&w=740&q=80",
                }}
              />
              <View style={styles.welcomeTextContainer}>
                <Text variant="headlineSmall" style={styles.welcomeText}>
                  Welcome, Melanie!
                </Text>
                <Text variant="bodyMedium" style={styles.subText}>
                  How’s it going today?
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Card>

        <Card style={styles.sectionCard} elevation={2}>
          <Card.Content>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Bluetooth Testing Section for Hardware
              </Text>
            </Card.Content>
            <View
              style={{
                flex: 1,
                marginTop: 12,
                gap: 6,
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor:
                    bluetoothState === "PoweredOn" ? "green" : "red",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>
                  {bluetoothState === "PoweredOn"
                    ? "Bluetooth ON"
                    : "Bluetooth OFF"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: bluetoothConnected ? "green" : "red",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>
                  {bluetoothConnected
                    ? "ESP32 Connected"
                    : "ESP32 Disconnected"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#4A90E2",
                  padding: 12,
                  borderRadius: 8,
                }}
                onPress={() => scanAndConnect()}
                disabled={!!bluetoothConnected}
              >
                <Text style={{ color: "white" }}>Connect to ESP32</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Pressure (bar):
            </Text>
            <PressureGraph data={pressureReadings} maxPoints={50} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 12,
              }}
            >
              <Button
                mode="contained"
                onPress={() => sendCommand("INFLATE")}
                style={{ backgroundColor: "#3498db" }}
              >
                Inflate
              </Button>
              <Button
                mode="contained"
                onPress={() => sendCommand("DEFLATE")}
                style={{ backgroundColor: "#e74c3c" }}
              >
                Deflate
              </Button>
            </View>
            
          </Card.Content>
        </Card>

        {/* 3D Foot Model Visualization */}
        <Card style={styles.footModelCard} elevation={3}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                3D Foot Model
              </Text>
              <View style={styles.rotateIconContainer}>
                <IconButton icon="rotate-3d" size={18} iconColor="#3b82f6" />
                <Text style={styles.rotateText}>Interactive</Text>
              </View>
            </View>

            <View
              onTouchStart={() => {
                console.log("Canvas touch start — disable scroll");
                setScrollEnabled(false);
              }}
              onTouchEnd={() => {
                console.log("Canvas touch end — enable scroll");
                setTimeout(() => setScrollEnabled(true), 200);
              }}
              onTouchCancel={() => {
                console.log("Canvas touch cancel — enable scroll");
                setScrollEnabled(true);
              }}
              style={{ width: "100%", alignItems: "center" }}
            >
              <ThreeJSFootVisualization />
            </View>
            <Text style={styles.modelInstructions}>
              Touch and drag to rotate • Pinch to zoom
            </Text>
          </Card.Content>
        </Card>

        {/* Backend Status */}
        <Card style={styles.sectionCard} elevation={2}>
          <Card.Content>
            <View style={styles.statusRow}>
              <View style={styles.statusCol}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  Server
                </Text>
                <Chip
                  compact
                  style={[
                    styles.chip,
                    {
                      backgroundColor: backendConnected
                        ? "rgba(46, 204, 113, 0.15)"
                        : "rgba(231, 76, 60, 0.15)",
                    },
                  ]}
                  textStyle={{
                    color: backendConnected ? "#2ecc71" : "#e74c3c",
                    fontWeight: "600",
                  }}
                >
                  {backendConnected ? "Connected" : "Disconnected"}
                </Chip>
              </View>

              <View style={styles.statusCol}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  Bluetooth
                </Text>
                <Chip
                  compact
                  style={[
                    styles.chip,
                    {
                      backgroundColor: bluetoothConnected
                        ? "rgba(52, 152, 219, 0.15)"
                        : "rgba(149, 165, 166, 0.15)",
                    },
                  ]}
                  textStyle={{
                    color: bluetoothConnected ? "#3498db" : "#7f8c8d",
                    fontWeight: "600",
                  }}
                >
                  {bluetoothConnected ? "Connected" : "Not Connected"}
                </Chip>
              </View>

              <Chip
                compact
                style={[
                  styles.chip,
                  { backgroundColor: "rgba(236, 240, 241, 0.2)" },
                ]}
                textStyle={{
                  color: "#7f8c8d",
                  fontWeight: "600",
                }}
              >
                Last Sync: 12 Oct 2024 05:00:00
              </Chip>
              <Chip
                compact
                style={[
                  styles.chip,
                  { backgroundColor: "rgba(236, 240, 241, 0.2)" },
                ]}
                textStyle={{
                  fontWeight: "600",
                }}
              >
                Current Patient Position: Standing
              </Chip>
            </View>
          </Card.Content>
        </Card>
        <View style={{ flex: 1, flexDirection: "column", gap: 16 }}>
          <LivePressureGraph />
          <LivePositionGraph/>
        </View>
        
        <Text style={styles.header}>🔧 System Connectivity</Text>

        <View style={styles.statusBox}>
          <Text style={styles.text}>
            Backend:{" "}
            {backendConnected === null
              ? "Checking..."
              : backendConnected
              ? "✅ Connected"
              : "❌ Not Connected"}
          </Text>

          <Text style={styles.text}>
            Firestore:{" "}
            {supabaseConnected === null
              ? "Checking..."
              : supabaseConnected
              ? "✅ Connected"
              : "❌ Not Connected"}
          </Text>
        </View>

        <Button mode="contained" onPress={addPatient}>
          Add Test Patient
        </Button>

        <Text style={[styles.header, { marginTop: 25 }]}>
          🧑‍⚕️ Patient Records
        </Text>

        {loading ? (
          <Text style={styles.text}>Loading patients...</Text>
        ) : patients.length === 0 ? (
          <Text style={styles.text}>No patients found.</Text>
        ) : (
          <FlatList
            data={patients}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <View style={styles.patientCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientDate}>
                    Added: {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deletePatient(item.id, item.name)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingTop: 60,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  statusBox: {
    marginBottom: 25,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  patientCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: 340,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  patientDate: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    padding: 10,
  },
  deleteText: {
    fontSize: 20,
    color: "red",
  },
  welcomeCard: {
    marginBottom: 20,
  },
  welcomeBackground: {
    height: 140,
    justifyContent: "center",
    padding: 16,
  },
  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    color: "#fff",
    fontWeight: "700",
  },
  subText: {
    color: "#fff",
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rotateIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  rotateText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  footModelCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  modelInstructions: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginLeft: 10,
    marginRight: 10,
  },
  statusCol: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  chip: {
    height: 32,
  },
  scrollContent: {
    gap:16,
    padding: 16,
  },
});
