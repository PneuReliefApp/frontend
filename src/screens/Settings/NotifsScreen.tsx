import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import {
  Card,
  Text,
  Switch,
  Divider,
  List,
  Chip,
  useTheme,
} from "react-native-paper";

export default function NotifsScreen() {
  const theme = useTheme();

  /**
   * ✅ Delivery options (how they wish to receive alerts)
   */
  const [deliverPush, setDeliverPush] = useState(true);
  const [deliverInApp, setDeliverInApp] = useState(true);
  const [deliverEmail, setDeliverEmail] = useState(false);
  const [deliverSms, setDeliverSms] = useState(false); // optional placeholder

  /**
   * ✅ Category 1: System connections
   */
  const [alertLowBattery, setAlertLowBattery] = useState(true);
  const [alertSystemConnected, setAlertSystemConnected] = useState(true);
  const [alertPressureSensorsConnected, setAlertPressureSensorsConnected] =
    useState(true);
  const [alertAirPressureSensorsConnected, setAlertAirPressureSensorsConnected] =
    useState(true);
  const [alertUpdatesAvailable, setAlertUpdatesAvailable] = useState(true);
  const [alertDataSyncHappened, setAlertDataSyncHappened] = useState(true);

  /**
   * ✅ Category 2: Phone notifications (pressure relief)
   */
  const [pressureReliefEnabled, setPressureReliefEnabled] = useState(true);

  // location-based toggles (edit/add more locations as needed)
  const [locHeel, setLocHeel] = useState(true);
  const [locToe, setLocToe] = useState(false);
  const [locArch, setLocArch] = useState(false);
  const [locBall, setLocBall] = useState(false);

  /**
   * Helpers
   */
  const deliverySummary = useMemo(() => {
    const enabled = [
      deliverPush ? "Push" : null,
      deliverInApp ? "In-app" : null,
      deliverEmail ? "Email" : null,
      deliverSms ? "SMS" : null,
    ].filter(Boolean);

    return enabled.length ? enabled.join(" • ") : "None";
  }, [deliverPush, deliverInApp, deliverEmail, deliverSms]);

  const anyDeliveryEnabled = useMemo(() => {
    return deliverPush || deliverInApp || deliverEmail || deliverSms;
  }, [deliverPush, deliverInApp, deliverEmail, deliverSms]);

  // Optional: if user disables all delivery channels, you can still keep toggles,
  // but show a warning chip so they know no alerts will arrive.
  const DeliveryWarning = () => {
    if (anyDeliveryEnabled) return null;
    return (
      <Chip compact style={{ alignSelf: "flex-start", marginTop: 10 }}>
        ⚠️ No delivery options selected (alerts won’t reach you)
      </Chip>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ✅ Delivery Options */}
      <Card style={styles.card}>
        <Card.Title title="How you receive alerts" />
        <Card.Content>
          <Text style={styles.desc}>
            Choose how you want to receive system and pressure alerts.
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Push notifications</Text>
            <Switch value={deliverPush} onValueChange={setDeliverPush} />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>In-app alerts</Text>
            <Switch value={deliverInApp} onValueChange={setDeliverInApp} />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Email</Text>
            <Switch value={deliverEmail} onValueChange={setDeliverEmail} />
          </View>

          {/* Optional: keep this if your rubric wants “options”, otherwise remove */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>SMS</Text>
            <Switch value={deliverSms} onValueChange={setDeliverSms} />
          </View>

          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.rowWrap}>
            <Text style={{ fontWeight: "700", marginRight: 8 }}>Enabled:</Text>
            <Chip compact>{deliverySummary}</Chip>
          </View>

          <DeliveryWarning />
        </Card.Content>
      </Card>

      {/* ✅ Category 1: System connections */}
      <Card style={styles.card}>
        <Card.Title title="System connections" />
        <Card.Content>
          <List.Item
            title="Low battery"
            description="Notify when battery level is low"
            right={() => (
              <Switch
                value={alertLowBattery}
                onValueChange={setAlertLowBattery}
              />
            )}
          />
          <Divider />

          <List.Item
            title="System connected"
            description="Notify when the system connects"
            right={() => (
              <Switch
                value={alertSystemConnected}
                onValueChange={setAlertSystemConnected}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Pressure sensors connected"
            description="Notify when pressure sensors connect/disconnect"
            right={() => (
              <Switch
                value={alertPressureSensorsConnected}
                onValueChange={setAlertPressureSensorsConnected}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Air pressure sensors connected"
            description="Notify when air pressure sensors connect/disconnect"
            right={() => (
              <Switch
                value={alertAirPressureSensorsConnected}
                onValueChange={setAlertAirPressureSensorsConnected}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Updates available"
            description="Notify when firmware/app updates are available"
            right={() => (
              <Switch
                value={alertUpdatesAvailable}
                onValueChange={setAlertUpdatesAvailable}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Data sync happened"
            description="Notify when data sync completes"
            right={() => (
              <Switch
                value={alertDataSyncHappened}
                onValueChange={setAlertDataSyncHappened}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* ✅ Category 2: Phone notifications (pressure relief) */}
      <Card style={styles.card}>
        <Card.Title title="Phone notifications" />
        <Card.Content>
          <List.Item
            title="Pressure relief alerts"
            description="Notify to alleviate pressure at a specific location"
            right={() => (
              <Switch
                value={pressureReliefEnabled}
                onValueChange={setPressureReliefEnabled}
              />
            )}
          />

          <Divider style={{ marginVertical: 12 }} />

          <Text style={{ fontWeight: "800", marginBottom: 8 }}>
            Alert locations
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Heel</Text>
            <Switch
              value={locHeel}
              onValueChange={setLocHeel}
              disabled={!pressureReliefEnabled}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Toe</Text>
            <Switch
              value={locToe}
              onValueChange={setLocToe}
              disabled={!pressureReliefEnabled}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Arch</Text>
            <Switch
              value={locArch}
              onValueChange={setLocArch}
              disabled={!pressureReliefEnabled}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Ball of foot</Text>
            <Switch
              value={locBall}
              onValueChange={setLocBall}
              disabled={!pressureReliefEnabled}
            />
          </View>

          {!pressureReliefEnabled && (
            <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
              Enable “Pressure relief alerts” to choose locations.
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  content: { padding: 16, paddingBottom: 28 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  card: { marginBottom: 12 },
  desc: { marginBottom: 8, fontSize: 14 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowWrap: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
});

