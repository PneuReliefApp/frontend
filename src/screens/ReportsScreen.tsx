import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Card,
  Button,
  useTheme,
  Divider,
  List,
  Avatar,
  DataTable,
} from "react-native-paper";
import TherapyCycleGraph from "../components/TherapyCycleGraph";

const ReportsScreen: React.FC = () => {
  const theme = useTheme();

  // Sample data for existing sections
  const highPressureEvents = [
    {
      id: 1,
      position: "Heel",
      start: new Date("2025-10-31T10:00:00"),
      end: new Date("2025-10-31T10:05:00"),
      duration: "5m",
    },
    {
      id: 2,
      position: "Heel",
      start: new Date("2025-10-31T11:15:00"),
      end: new Date("2025-10-31T11:20:30"),
      duration: "5m 30s",
    },
    {
      id: 3,
      position: "Right Ankle",
      start: new Date("2025-10-31T12:45:00"),
      end: new Date("2025-10-31T12:50:00"),
      duration: "5m",
    },
  ];

  // New Placeholder Data for Pneumatic Activity Table
  const pneumaticActivityData = [
    { zone: "Posterior toe", inflated: "10:15", sustained: "10:20", deflated: "10:25" },
    { zone: "Heel pad", inflated: "10:16", sustained: "10:21", deflated: "10:26" },
    { zone: "Medial malleolus", inflated: "10:17", sustained: "10:22", deflated: "10:27" },
    { zone: "First metatarsal", inflated: "10:18", sustained: "10:23", deflated: "10:28" },
    { zone: "Lateral malleolus", inflated: "10:19", sustained: "10:24", deflated: "10:29" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Button mode="outlined" style={styles.downloadButton}>
        Download
      </Button>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ========== Pressure Readings Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pressure Readings</Text>
            <Divider style={{ marginVertical: 8 }} />

            <View style={{ padding: 16 }}>
              {/* Avg Pressure */}
              <View
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Avatar.Icon
                    size={40}
                    icon="speedometer"
                    style={{ backgroundColor: "#4caf50", marginRight: 12 }}
                  />
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Avg Pressure
                    </Text>
                    <Text style={{ fontSize: 16 }}>120 kPa</Text>
                  </View>
                </View>
              </View>

              {/* Lowest + Peak */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#e6f7ff",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Icon
                      size={32}
                      icon="arrow-down-bold-circle"
                      style={{ backgroundColor: "#2196f3", marginRight: 10 }}
                    />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Lowest
                      </Text>
                      <Text style={{ fontSize: 14 }}>80 kPa</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#ffe6e6",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Icon
                      size={32}
                      icon="arrow-up-bold-circle"
                      style={{ backgroundColor: "#f44336", marginRight: 10 }}
                    />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Peak
                      </Text>
                      <Text style={{ fontSize: 14 }}>160 kPa</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* ========== High Pressure Events Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>High Pressure Events</Text>
            <Divider style={{ marginVertical: 8 }} />

            <View
              style={{
                backgroundColor: "#ff9800",
                borderRadius: 10,
                padding: 16,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Time in High Pressure
              </Text>
              <Text style={{ fontSize: 16 }}>15min 30s</Text>
            </View>

            <List.Section>
              <List.Accordion
                title={`High Events Count: ${highPressureEvents.length}`}
                left={(props) => (
                  <List.Icon {...props} icon="alert-circle-outline" />
                )}
                style={{ backgroundColor: "#ffe6e6" }}
              >
                {highPressureEvents.map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <Text style={styles.eventText}>
                      Position: {event.position}
                    </Text>
                    <Text style={styles.eventText}>
                      Start: {event.start.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.eventText}>
                      End: {event.end.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.eventText}>
                      Duration: {event.duration}
                    </Text>
                    <Divider style={{ marginVertical: 8 }} />
                  </View>
                ))}
              </List.Accordion>
            </List.Section>
          </Card.Content>
        </Card>

        {/* ========== Therapy Cycle Graph Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Therapy Cycle Timeline</Text>
            <Divider style={{ marginVertical: 8 }} />
            <TherapyCycleGraph />
          </Card.Content>
        </Card>

        {/* ========== Pneumatic Activity Table Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pneumatic Activity</Text>
            <Divider style={{ marginVertical: 8 }} />

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 2 }}>Zone</DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>Inflated</DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>Sustained</DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>Deflated</DataTable.Title>
              </DataTable.Header>

              {pneumaticActivityData.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell style={{ flex: 2 }}>
                    <Text style={{ fontWeight: "600", color: "#2c3e50" }}>
                      {item.zone}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>{item.inflated}</DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>{item.sustained}</DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>{item.deflated}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  downloadButton: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 10,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    marginVertical: 8,
    borderRadius: 10,
    borderTopWidth: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  eventItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  eventText: {
    fontSize: 14,
  },

  centerColumn: {
    flex: 1,
    justifyContent: "center",
  },
});
