import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Card,
  Button,
  Title,
  Paragraph,
  useTheme,
  Divider,
  List,
  Avatar,
} from "react-native-paper";
import TherapyCycleGraph from "../components/TherapyCycleGraph";

const ReportsScreen: React.FC = () => {
  const theme = useTheme();

  // Sample data
  const pressureReadings = [
    { id: 1, title: "Average Pressure", value: "72 mmHg", color: "#4caf50" }, // green
    { id: 2, title: "Peak Pressure", value: "110 mmHg", color: "#f44336" }, // red
    { id: 3, title: "Lowest Pressure", value: "60 mmHg", color: "#2196f3" }, // blue
  ];

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

            {/* Grid-style layout */}
            <View style={{ padding: 16 }}>
              {/* Avg Pressure on Top (Full Width) */}
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
                    icon="speedometer" // you can pick "speedometer", "gauge", etc.
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

              {/* Lowest + Peak in One Row (Each Half Width) */}
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

                {/* Peak Pressure */}
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
});
