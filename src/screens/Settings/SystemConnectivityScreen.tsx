import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Card, Text, Chip, Button } from "react-native-paper";

import { checkConnection } from "../../services/api";
import { supabase } from "../../services/supabase_client";

type ConnState = boolean | null;

const SystemConnectivityScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const [backendConnected, setBackendConnected] = useState<ConnState>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<ConnState>(null);

  // placeholders for now (wire to actual bluetooth/sensor states later)
  const [pressureSensorConnected, setPressureSensorConnected] =
    useState<ConnState>(null);
  const [airPressureSensorConnected, setAirPressureSensorConnected] =
    useState<ConnState>(null);

  const chipFor = (label: string, value: ConnState) => {
    const isOn = value === true;
    const isOff = value === false;
    const unknown = value === null;

    const text = unknown ? "Checking..." : isOn ? "Connected" : "Disconnected";

    const bg = unknown
      ? "rgba(149,165,166,0.15)"
      : isOn
      ? "rgba(46,204,113,0.15)"
      : "rgba(231,76,60,0.15)";

    const fg = unknown ? "#7f8c8d" : isOn ? "#2ecc71" : "#e74c3c";

    return (
      <View style={styles.row} key={label}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Chip
          compact
          style={[styles.chip, { backgroundColor: bg }]}
          textStyle={{ color: fg, fontWeight: "700" }}
        >
          {text}
        </Chip>
      </View>
    );
  };

  const loadAll = useCallback(async () => {
    // Backend connection
    try {
      const ok = await checkConnection();
      setBackendConnected(ok);
    } catch {
      setBackendConnected(false);
    }

    // "Firestore" label (you currently use Supabase; keep the label as requested)
    try {
      const { error } = await supabase.auth.getSession();
      setFirestoreConnected(!error);
    } catch {
      setFirestoreConnected(false);
    }

    // Sensors (placeholder)
    if (pressureSensorConnected === null) setPressureSensorConnected(false);
    if (airPressureSensorConnected === null) setAirPressureSensorConnected(false);
  }, [pressureSensorConnected, airPressureSensorConnected]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="System Connectivity" />
        <Card.Content>
          {chipFor("Backend connection", backendConnected)}
          {chipFor("Firestore", firestoreConnected)}
          {chipFor("Pressure sensors", pressureSensorConnected)}
          {chipFor("Air pressure sensors", airPressureSensorConnected)}

          <Button mode="outlined" onPress={loadAll} style={{ marginTop: 14 }}>
            Refresh Status
          </Button>

          <Text style={styles.hint}>
            Sensor status is currently a placeholder. Wire it to your Bluetooth
            connection state when ready.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default SystemConnectivityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  sectionCard: { marginBottom: 16, borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  chip: { height: 32 },
  hint: { marginTop: 10, color: "gray", fontSize: 12 },
});

