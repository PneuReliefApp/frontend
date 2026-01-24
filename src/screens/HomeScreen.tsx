import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  Chip,
  Button,
  Card,
  Avatar,
  IconButton,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";

import { checkConnection } from "../services/api";
import { supabase } from "../services/supabase_client";
import ThreeJSFootVisualization from "../components/ThreeJSFootVisualization";
import LivePressureGraph from "../graphs/live_pressure_graph";
import LivePositionGraph from "../graphs/live_position_graph";

type Role = "patient" | "caregiver";

export default function HomeScreen() {
  // Connection states (kept for the "Backend Status" card)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [bluetoothConnected, setBluetoothConnected] = useState<boolean | null>(null);

  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Patients state (caregiver-only)
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false);

  // Profile/meta
  const [displayName, setDisplayName] = useState<string>("there");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [role, setRole] = useState<Role>("patient");

  // Name prompt dialog
  const [showNameDialog, setShowNameDialog] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>("");
  const [savingName, setSavingName] = useState<boolean>(false);

  const MALE_AVATAR =
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740";
  const FEMALE_AVATAR =
    "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?w=740";

  const resolveAvatarUrl = (g: "male" | "female") =>
    g === "female" ? FEMALE_AVATAR : MALE_AVATAR;

  const isCaregiver = role === "caregiver";

  // ✅ Load name + avatar + role (safe) and refresh on focus
  const loadUserPrefs = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data?.user;

      if (!user) {
        setDisplayName("there");
        setShowNameDialog(false);
        setAvatarUrl(resolveAvatarUrl("male"));
        setRole("patient");
        return;
      }

      // name (SAFE)
      const rawMetaName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.user_metadata?.display_name;

      const metaName = typeof rawMetaName === "string" ? rawMetaName.trim() : "";
      const emailPrefix = user.email ? user.email.split("@")[0] : "there";

      if (metaName.length > 0) {
        setDisplayName(metaName);
        setShowNameDialog(false);
      } else {
        setDisplayName(emailPrefix || "there");
        setNameInput("");
        setShowNameDialog(true);
      }

      // avatar
      const rawGender = user.user_metadata?.avatar_gender;
      const metaGender: "male" | "female" = rawGender === "female" ? "female" : "male";
      setAvatarUrl(resolveAvatarUrl(metaGender));

      // role
      const rawRole = user.user_metadata?.role;
      const metaRole: Role = rawRole === "caregiver" ? "caregiver" : "patient";
      setRole(metaRole);
    } catch (e) {
      console.error("Failed to load user prefs:", e);
      setDisplayName("there");
      setShowNameDialog(false);
      setAvatarUrl(resolveAvatarUrl("male"));
      setRole("patient");
    }
  }, []);

  useEffect(() => {
    loadUserPrefs();
  }, [loadUserPrefs]);

  useFocusEffect(
    useCallback(() => {
      loadUserPrefs();
    }, [loadUserPrefs])
  );

  const saveDisplayName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }

    try {
      setSavingName(true);

      const { error } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });

      if (error) throw error;

      await supabase.auth.getUser();

      setDisplayName(trimmed);
      setShowNameDialog(false);
    } catch (e: any) {
      console.error("Failed to save name:", e?.message || e);
      Alert.alert("Failed to save name", e?.message || "Please try again.");
    } finally {
      setSavingName(false);
    }
  };

  const cancelNameDialog = () => setShowNameDialog(false);

  // Backend connectivity
  const testBackendConnection = async () => {
    try {
      const ok = await checkConnection();
      setBackendConnected(ok);
    } catch (e) {
      console.error("Backend unreachable:", e);
      setBackendConnected(false);
    }
  };

  // Caregiver-only: load patients
  const loadPatients = async () => {
    if (!isCaregiver) {
      setPatients([]);
      setLoadingPatients(false);
      return;
    }

    try {
      setLoadingPatients(true);

      const { data, error } = await supabase.from("patients").select("*").limit(50);
      if (error) throw error;

      setPatients(data || []);
    } catch (e: any) {
      console.error("Failed to load patients:", e?.message || e);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  // run backend check always; load patients only if caregiver
  useEffect(() => {
    testBackendConnection();
  }, []);

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCaregiver]);

  // caregiver-only add patient
  const addPatient = async () => {
    if (!isCaregiver) {
      Alert.alert("Not allowed", "Only caregivers can add patients.");
      return;
    }

    try {
      const { error } = await supabase
        .from("patients")
        .insert([
          {
            name: `Patient ${patients.length + 1}`,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      Alert.alert("Success", "Patient added successfully!");
      await loadPatients();
    } catch (error: any) {
      console.error("Error adding patient:", error.message || error);
      Alert.alert("Error", "Failed to add patient.");
    }
  };

  const deletePatient = async (id: string, name: string) => {
    if (!isCaregiver) {
      Alert.alert("Not allowed", "Only caregivers can delete patients.");
      return;
    }

    Alert.alert("Confirm Deletion", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("patients").delete().eq("id", id);
            if (error) throw error;
            await loadPatients();
          } catch (error: any) {
            console.error("Error deleting patient:", error.message || error);
            Alert.alert("Error", "Failed to delete patient.");
          }
        },
      },
    ]);
  };

  return (
    <>
      <Portal>
        <Dialog visible={showNameDialog} onDismiss={cancelNameDialog}>
          <Dialog.Title>Set your name</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 10 }}>
              What should we call you? (This will be shown on the home screen.)
            </Text>
            <TextInput
              label="Your name"
              value={nameInput}
              onChangeText={setNameInput}
              mode="outlined"
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="e.g., Nigel"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelNameDialog} disabled={savingName}>
              Skip
            </Button>
            <Button
              mode="contained"
              onPress={saveDisplayName}
              loading={savingName}
              disabled={savingName}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
                <Avatar.Image size={80} source={{ uri: avatarUrl || MALE_AVATAR }} />
                <View style={styles.welcomeTextContainer}>
                  <Text variant="headlineSmall" style={styles.welcomeText}>
                    Welcome, {displayName}!
                  </Text>
                  <Text variant="bodyMedium" style={styles.subText}>
                    How’s it going today?
                  </Text>
                </View>
              </View>
            </ImageBackground>
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
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setTimeout(() => setScrollEnabled(true), 200)}
                onTouchCancel={() => setScrollEnabled(true)}
                style={{ width: "100%", alignItems: "center" }}
              >
                <ThreeJSFootVisualization />
              </View>
              <Text style={styles.modelInstructions}>
                Touch and drag to rotate • Pinch to zoom
              </Text>
            </Card.Content>
          </Card>

          {/* Status Overview (kept) */}
          <Card style={styles.sectionCard} elevation={2}>
            <Card.Content>
              <View style={styles.statusRow}>
                <View style={styles.statusCol}>
                  <Text style={{ color: "black", fontWeight: "600" }}>Server</Text>
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
                  <Text style={{ color: "black", fontWeight: "600" }}>Bluetooth</Text>
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
                  style={[styles.chip, { backgroundColor: "rgba(236, 240, 241, 0.2)" }]}
                  textStyle={{ color: "#7f8c8d", fontWeight: "600" }}
                >
                  Last Sync: 12 Oct 2024 05:00:00
                </Chip>

                <Chip
                  compact
                  style={[styles.chip, { backgroundColor: "rgba(236, 240, 241, 0.2)" }]}
                  textStyle={{ fontWeight: "600" }}
                >
                  Current Patient Position: Standing
                </Chip>
              </View>
            </Card.Content>
          </Card>

          <View style={{ flex: 1, flexDirection: "column", gap: 16 }}>
            <LivePressureGraph />
            <LivePositionGraph />
          </View>

          {/* ✅ REMOVED: System Connectivity section (moved to Settings -> System Connectivity) */}

          {/* ✅ Caregiver-only section */}
          {isCaregiver ? (
            <>
              <Button mode="contained" onPress={addPatient}>
                Add Test Patient
              </Button>

              <Text style={[styles.header, { marginTop: 25 }]}>
                🧑‍⚕️ Patient Records
              </Text>

              {loadingPatients ? (
                <Text style={styles.text}>Loading patients...</Text>
              ) : patients.length === 0 ? (
                <Text style={styles.text}>No patients found.</Text>
              ) : (
                <FlatList
                  data={patients}
                  keyExtractor={(item: any) => String(item.id)}
                  renderItem={({ item }) => (
                    <View style={styles.patientCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <Text style={styles.patientDate}>
                          Added:{" "}
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "Unknown"}
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
            </>
          ) : (
            <Card style={styles.sectionCard} elevation={2}>
              <Card.Content>
                <Text style={{ fontWeight: "700", marginBottom: 6 }}>
                  Caregiver access required
                </Text>
                <Text style={{ color: "gray" }}>
                  Patient records and adding patients are only available to caregivers.
                  You can change your role in Settings → Edit Profile.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingTop: 60,
    padding: 20,
  },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  text: { fontSize: 18, marginVertical: 5 },

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
  patientName: { fontSize: 18, fontWeight: "bold" },
  patientDate: { fontSize: 14, color: "#555" },
  deleteButton: { padding: 10 },
  deleteText: { fontSize: 20, color: "red" },

  welcomeCard: { marginBottom: 20 },
  welcomeBackground: { height: 140, justifyContent: "center", padding: 16 },
  welcomeContent: { flexDirection: "row", alignItems: "center" },
  welcomeTextContainer: { marginLeft: 16, flex: 1 },
  welcomeText: { color: "#fff", fontWeight: "700" },
  subText: { color: "#fff", marginTop: 4 },

  sectionCard: { marginBottom: 16 },
  cardContent: { padding: 16 },
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
  rotateText: { fontSize: 12, color: "#3b82f6", fontWeight: "600" },
  footModelCard: { marginBottom: 16, borderRadius: 12, overflow: "hidden" },
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
  statusCol: { flexDirection: "column", alignItems: "center", gap: 3 },
  chip: { height: 32 },

  scrollContent: { gap: 16, padding: 16 },
});



