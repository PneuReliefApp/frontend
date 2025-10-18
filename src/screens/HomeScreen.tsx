import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import {
  Text,
  Switch,
  Menu,
  Button,
  Divider,
  Card,
  Avatar,
  Chip,
  useTheme,
  IconButton,
} from "react-native-paper";
import Slider from "@react-native-community/slider";

import { checkConnection } from "../services/api";
import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

import {
  BLEInstance,
  requestBluetoothPermissions,
} from "../services/bluetooth";

import ThreeJSFootVisualization from "../components/ThreeJSFootVisualization";

export default function HomeScreen() {
  // ✅ Connection states
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null
  );
  const [bluetoothConnected, setBluetoothConnected] = useState<boolean | null>(
    null
  );
  const [device, setDevice] = useState<any>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(
    null
  );

  // ✅ Firestore data state
  const [patients, setPatients] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = React.useState<boolean | null>(null);

  const manager = BLEInstance.manager;
  const SERVICE_UUID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; // replace with your ESP32 service UUID
  const CHARACTERISTIC_UUID = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy";

  // Check backend connection
  React.useEffect(() => {
    const testConnection = async () => {
      const ok = await checkConnection();
      setConnected(ok);
    };
    testConnection();
  }, []);

  const setupOnDeviceDisconnected = (deviceId: any) => {
    manager.onDeviceDisconnected(deviceId, (error, device) => {
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
        });
      }
    });
  };

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        manager.stopDeviceScan();
        return;
      }
      if (device?.name === "ESP32_BLUETOOTH") {
        console.log(device?.name);
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
              CHARACTERISTIC_UUID
            );
          console.log("Characteristic value:", characteristic.value);

          device.monitorCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            (error, characteristic) => {
              if (characteristic?.value) {
              }
            }
          );
        } catch (err) {
          console.error("Connection error:", err);
          setBluetoothConnected(false);
        }
      } else {
        setBluetoothConnected(false);
      }
    });
  };

  // --- Function to test Firestore ---
  const testFirestoreConnection = async () => {
    try {
      const snapshot = await getDocs(collection(db, "patients"));
      console.log(
        "✅ Firestore connected. Sample docs:",
        snapshot.docs.map((doc) => doc.data())
      );
      setFirestoreConnected(true);
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("❌ Firestore connection failed:", error);
      setFirestoreConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // --- Function to add a test patient ---
  const addPatient = async () => {
    try {
      const docRef = await addDoc(collection(db, "patients"), {
        name: `Patient ${patients.length + 1}`,
        createdAt: new Date().toISOString(),
      });
      console.log("✅ Patient added with ID:", docRef.id);
      alert("Patient added successfully!");
      await testFirestoreConnection(); // Refresh list
    } catch (error) {
      console.error("❌ Error adding patient:", error);
      alert("Failed to add patient to Firestore.");
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
              await deleteDoc(doc(db, "patients", id));
              console.log(`🗑️ Deleted patient ${name} (${id})`);
              await testFirestoreConnection(); // Refresh list
            } catch (error) {
              console.error("❌ Error deleting patient:", error);
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
      await testFirestoreConnection();
    };
    runAllTests();

    const initBluetooth = async () => {
      console.log("init bluetooth");
      const granted = await requestBluetoothPermissions();
      if (!granted) {
        console.warn("Bluetooth permission not granted");
        return;
      }
      const subscription = manager.onStateChange((state) => {
        console.log("init bluetooth111");
        if (state === "PoweredOn") {
          scanAndConnect();
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    };
    initBluetooth();
  }, []);

  // --- Render UI ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {/* Dashboard Section */}
        <Card style={styles.sectionCard} elevation={2}>
          <Card.Content>
            <Text style={{ marginTop: 4 }}>Dashboard Section</Text>
          </Card.Content>
        </Card>

        {/* Backend Status */}
        <Card style={styles.card} mode="elevated">
          <View style={styles.row}>
            <Text style={styles.title}>System Status</Text>

            <IconButton
              icon="refresh"
              size={18}
              //      onPress={onRefresh}
              accessibilityLabel="Refresh status"
            />
          </View>

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

              <ThreeJSFootVisualization />

              <Text style={styles.modelInstructions}>
                Touch and drag to rotate • Pinch to zoom
              </Text>
            </Card.Content>
          </Card>

          <Divider style={{ marginBottom: 6 }} />

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
              Last Synced: 12 Oct 2024 05:00:00
            </Chip>
          </View>
        </Card>

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
            {firestoreConnected === null
              ? "Checking..."
              : firestoreConnected
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
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
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
  card: {
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
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
    padding: 16,
  },
});
