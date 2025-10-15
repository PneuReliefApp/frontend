import React, { useEffect, useState } from "react";

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
  Button,
  Divider,
  Card,
  Avatar,
  useTheme,
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
import { BLEInstance, requestBluetoothPermissions } from "../services/bluetooth";

export default function HomeScreen() {
  // ✅ Connection states
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null
  );
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(
    null
  );

  // ✅ Firestore data state
  const [patients, setPatients] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = React.useState<boolean | null>(null);

  const manager = BLEInstance.manager;

  // Check backend connection
  React.useEffect(() => {
    const testConnection = async () => {
      const ok = await checkConnection();
      setConnected(ok);
    };
    testConnection();

    const initBluetooth = async() =>{
      console.log("init bluetooth")
      const granted = await requestBluetoothPermissions();
      if(!granted){
        console.warn("Bluetooth permission not granted");
        return;
      }
      const subscription = manager.onStateChange(state=>{
        console.log("init bluetooth111")
        if(state === 'PoweredOn'){
          scanAndConnect()
          subscription.remove()
        }
      }, true);
      return() => subscription.remove();
    };
    initBluetooth();
  }, []);

  const scanAndConnect = () =>{
    manager.startDeviceScan(null, null, (error, device)=>{
      if(error){
        manager.stopDeviceScan();
        return;
      }
      if(device?.name === "ESP32_BLUETOOTH"){
        console.log(device?.name);
      }
    })
  }

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
  }, []);

  // --- Render UI ---
  return (
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

      {/* Dashboard Section */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Content>
          <Text style={{ marginTop: 4 }}>Dashboard Section</Text>
        </Card.Content>
      </Card>

      {/* Backend Status */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Backend Status
          </Text>
          <Text style={{ marginTop: 4 }}>
            {connected === null
              ? "Checking..."
              : connected
              ? "✅ Connected"
              : "❌ Not Connected"}
          </Text>
        </Card.Content>
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

      <Text style={[styles.header, { marginTop: 25 }]}>🧑‍⚕️ Patient Records</Text>

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
});
